const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv"); // Define the dotenv package
dotenv.config(); 
const Charger = require('./models/EV_charge.js');
const dbUrl = 'mongodb://localhost:27017/Electric';
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/User.js');
const generateToken = require('./utils/token.js');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.REACT_APP_MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});
const UserBooks = require('./models/UserBooks.js');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
      console.log(err);
  })

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/api/', async (req,res)=>{
    // res.send("api connected");
    const al = await User.find({});
    console.log(al);
    res.send(al);
});

// user login / register 
app.post('/api/auth/google', async (req, res) => {
    // console.log("req body is : ",req.body);
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();
    const founduser = await User.findOne({email:email});
    // console.log("founduser is ",founduser);
    if(founduser !== null){
        res.status(201);
        res.json(founduser);
    }else{
        const user = new User({
            email:email,
            username:name,
            bookings:[]
        })
        await user.save(function(err,result){
            if (err)console.log(err);
            else console.log(result)
        });
        res.status(201);
        res.json(user);
    }
});
  
// app.post('/api/auth/facebook',async (req,res) => {
//     console.log(req);
// })

// get the station routes.
// station login
app.post('/api/station/login',async(req,res)=>{
    const {email,password} = req.body;
    const foundstation = await Charger.findOne({email:email});
    if(foundstation && (await foundstation.matchPassword(password))){
        const token = generateToken(foundstation._id);
        res.cookie('jwt', token, {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: false,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
        });
        res.status(201);
        res.json({
            _id:foundstation._id,
            location:foundstation.location,
            email:foundstation.email,
            slots:foundstation.slots,
            maxslots:foundstation.maxslots,
            state:foundstation.state,
            token:token        
        });
    }else{
        res.status(404);
        throw new Error('Station does not exist');
    }
});

// station register 
app.post('/api/register/', async(req,res)=>{

    try{
        console.log('req body is : ', req.body);
        const {username,location,email,maxslots,state,password,type} = req.body;
        const geoData = await geocoder.forwardGeocode({
            query:location,
            limit:1
        }).send();

        console.log('geodata is : ', geoData.body.features[0].geometry);

        const foundstation = await Charger.findOne({email:email});
        console.log('foundstation is : ',foundstation);
        if(foundstation){
            res.status(400);
            throw new Error('User Email already Exists');
        }
        const station = await new Charger({
            username,
            location,
            email,
            maxSlots: maxslots,
            slots:0,
            state,
            password,
            type,
            geometry:geoData.body.features[0].geometry
        })
        // console.log(station);

        if(station){
            // add saving scene here;
            station.save();
            res.status(201).json({
                _id:station._id,
                username:station.username,
                location:station.location,
                email:station.email,
                maxSlots:station.maxSlots,
                slots:0,
                state:station.state,
                geometry:station.geometry,
                type:station.type,
                token:generateToken(station._id)
            });
        }else{
            res.status(404);
            throw new Error('Invalid station');
        }
    }catch(err){
        console.log(err);
    }
});

app.get('/api/getstations/',async(req,res)=> {
    const dd = await Charger.find({});
    console.log(dd);
    res.status(201).json(dd);
})


app.post('/api/user/bookings',async(req,res)=>{

    const {email,username} = req.body;
    const user = await User.findOne({email:email});
    console.log('user is : ',user);
    // res.send("high");
    if(user){

            const cs = await Charger.find({});
            // console.log('chargers is : ',cs);
            let avail = [];
            let non_avail = [];
            // console.log(user.bookings);
            if(user.bookings.length === 0){
                avail.push(...cs);
            }else {
                for(var i=0;i<user.bookings.length;i++){
                    var z = user.bookings[i];
                    var book = UserBooks.findById(z);
                    var st = Charger.findById(book.station_id);
                    cs = cs.filter(s => s._id!=st._id);
                    non_avail = [...non_avail,st];
                }
                avail.push(...cs);
                // non_avail = cs.filter(s => user.bookings.station_id.includes(s._id));
                // avail = cs.filter(s => !user.bookings.station_id.includes(s._id));
            }

            // console.log('avail is : ', avail);
            // console.log('non_avail is : ', non_avail);
            res.status(201).json({
                available:[...avail],
                not_available: [...non_avail]
            });
        }else{
            res.status(404);
            throw new error('User not logged in');
        }
})

app.post('/api/user/update/',async(req,res) => {
    const {email,id_extract} = req.body;
    const user = await User.find({email:email});
    const station = await Charger.find({_id:id_extract});
    console.log('user is :', user);

    if(user){
        let new_entry = new UserBooks({
            station_id:id_extract,
            Accept:false,
            Decline:false
        });
        console.log(user.bookings);
        
        if(user.bookings){
            user.bookings.push(new_entry._id);
        }else{
            user.bookings = [new_entry._id];
        }
        if(station.slots<station.maxSlots){
            station.slots = station.slots + 1;
        }

        await station.save();
        await new_entry.save();
        const nuser = await user.save();
       
        nuser === user; // 
        res.status(201).json({
            userif:user
        });
    }else{
        res.status(404);
        throw new error('unable to update');
    }
})

// get bookings of a particular user
app.post('/api/users/getbookings',async(req,res)=>{
    const {email} = req.body;
    const u = await User.findOne({email:email});
    let to_send = [];
    for(var i=0;i<u.bookings.length;i++){
        var book = UserBooks.findById(u.bookings[i]);
        to_send = [...to_send,book];
    }
    res.status(201).json({
        bookings:to_send
    });
})


// accept/decline 

app.listen(3000,()=>{
    console.log('server connected on port 3000');
})
