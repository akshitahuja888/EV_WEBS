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
    console.log("req body is : ",req.body);
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
  
app.post('/api/auth/facebook',async (req,res) => {
    console.log(req);
})

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
app.post('/api/register', async(req,res)=>{

    // console.log('req body is : ', req.body);
    const {location,email,maxslots,state,password} = req.body;
    // console.log('location is : ', location);
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
        location,
        email,
        maxSlots: maxslots,
        slots:0,
        state,
        password,
        geometry:geoData.body.features[0].geometry
    })
    console.log(station);

    if(station){
        // add saving scene here;
        station.save();
        res.status(201).json({
            _id:station._id,
            location:station.location,
            email:station.email,
            maxSlots:station.maxSlots,
            slots:0,
            state:station.state,
            geometry:station.geometry,
            // type:station.type,
            token:generateToken(station._id)
        });
    }else{
        res.status(404);
        throw new Error('Invalid station');
    }
});

app.get('/api/getstations/',async(req,res)=> {
    const dd = await Charger.find({});
    console.log(dd);
    res.status(201).json(dd);
})

app.get('/api/admin/bookings/',async(req,res)=>{
    const {email,username} = req.body;
    const user = await User.find({email:email});
    if(user){
        const cs = await Charger.find({});
        let avail = [];
        let non_avail = [];
        non_avail = cs.filter(s => user.bookings.station_id.includes(s._id));
        avail = cs.filter(s => !user.bookings.station_id.includes(s._id));

        res.status(201).json({
            available:avail,
            non_available:non_avail
        })
    }else{
        res.status(404);
        throw new error('User not logged in');
    }
})




// accept/decline 

app.listen(3000,()=>{
    console.log('server connected on port 3000');
})

// // FLASH MIDDLEWARE
// app.use((req,res,next)=>{
//     if(!['/login','/'].includes(req.originalUrl)){
//         req.session.returnTo = req.originalUrl;
//     }
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })


// app.get('/api/station/logout',(req,res) => {
//     req.logOut();
//     req.session.destroy((err) => {
//         console.log('Failed to destroy the session',err);
//         req.charger = null;
//         res.redirect('/api/');
//     })
// });


// app.use(passport.initialize());
// app.use(passport.session());


// //THE LOCAL MONGOOSE CONTAINS THIS AS A PRE-DEFINDE FUNCTION ALREADY 
// passport.use(new LocalStrategy(User.authenticate()));


// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });


