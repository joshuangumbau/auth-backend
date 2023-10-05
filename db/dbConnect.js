const mongoose = require('mongoose');
require('dotenv').config ()

async function connectDB(){

}

module.exports = connectDB;

//using mongoose to connect to the database

mongoose.connect(process.env.DB_URL),{
    //options to ensure that the connection is successful
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}

//check if the connection is successful
mongoose.connection.on('connected', () =>{
    console.log('Successfully connected to the database')
})

//check if there is an error in the connection 
mongoose.connection.on('error', (err) =>{
    console.log('error connecting to the database')
})

//check if the connection is disconnected
mongoose.connection.on('error', () =>{
    console.log('disconnected from the database')
})

mongoose.connection.on('disconnected', () =>{
    console.log('disconnected from the database')
})

mongoose.connection.on('reconnected', () =>{
    console.log('reconnected to the database')
})

//export the connection
module.exports = connectDB;


// Path: app.js
// Compare this snippet from index.js:
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
