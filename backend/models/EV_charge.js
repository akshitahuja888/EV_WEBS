const express = require('express');
const mongoose = require('mongoose');


const ChargerSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    location:{
        type:String,
        required:true
    },
    maxSlots:{
        type:Number,
        required:true
    },
    slots:{
        type:Number
    },
    state:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      type:{
          type:String,
        //   required:true
      }
});

const Charger = mongoose.model('Charger',ChargerSchema);
module.exports = Charger;