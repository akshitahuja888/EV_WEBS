// const express = require('express');
// const mongoose = require('mongoose');
// const Charger = require('./EV_charge.js');

// const AdminSchema = new mongoose.Schema({
//     username:{
//         type:String,
//         required:true
//     },
//     emailID:{
//         type:String,
//         required:true
//     },
//     stations:[
//         {
//             type:mongoose.Schema.Types.ObjectId,
//             ref: 'Charger'
//         }
//     ]
// });

// // console.log('e1');
// const Admin = mongoose.model('Admin', AdminSchema);
// module.exports = Admin;