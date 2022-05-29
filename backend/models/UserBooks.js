const express = require('express');
const mongoose = require('mongoose');

const UserBooksSchema = mongoose.Schema({
    location:{
        type:String,
        required:true
    },
    Accept:{
        type:Boolean,
        default:false
    },
    Decline:{
        type:Boolean,
        default:false
    }
})

const UserBooks = mongoose.model('UserBooks',UserBooksSchema);
module.exports = UserBooks;