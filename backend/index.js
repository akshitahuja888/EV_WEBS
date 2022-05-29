const express = require('express');
const mongoose = require('mongoose');
const Charger = require('./models/EV_charge.js');
const dbUrl = 'mongodb://localhost:27017/Electric';
// const authRoutes = require('./routes/auth_routes');
const passport = require('passport');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/User.js');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
      console.log(err);
  })

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    if(founduser.email !== null){
        res.status(201);
        res.json(founduser);
    }else{
        const user = new User({
            email:email,
            username:name,
            bookings:[]
        })
        // console.log('------------------------------------------------');
        // console.log(user);
        await user.save(function(err,result){
            if (err)console.log(err);
            else console.log(result)
        });
        // console.log('user saved');
        res.status(201);
        res.json(user);
    }
});
  
app.post('/api/auth/facebook',async (req,res) => {
    console.log(req);
})

// get the station routes.
app.post('/api/station/login',(req,res)=>{
    const {location,email,maxslots,state} = req.body;
    const foundstation = Charger.findOne({email:email})
    if(foundstation){
        res.status(201);
        res.send(foundstation);
    }else{
        res.status(400);
        throw new Error('Station does not exist');
    }
});

app.post('/api/station/register',(req,res)=>{
    const {location,email,maxslots,slots,state} = req.body;
    const foundstation = Charger.findOne({email:email});
    if(foundstation){
        res.status(400);
        throw new Error('User Email already Exists');
    }

    const station = new Charger({
        location,
        email,
        maxslots,
        slots,
        state
    })

    if(station){
        // add saving scene here;
        station.save(function(err,result){
            if(err)console.log(err);
            else console.log(result);
        })
        res.status(201);
        res.send(station);
    }else{
        res.status(400);
        throw new Error('Invalid station');
    }
});

app.get('/api/station/logout',(req,res) => {
    req.logOut();
    req.session.destroy((err) => {
        console.log('Failed to destroy the session',err);
        req.charger = null;
        res.redirect('/api/');
    })
});


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

