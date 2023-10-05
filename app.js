const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// body parser configuration
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});


const connectDB = require('./db/dbConnect');
const User = require('./db/userModel');

connectDB();
//create a register endpoint
app.post('/register', async (req, res) => {
  //hash the password
  bcrypt
    .hash(req.body.password,10)
    .then(async (hashedPassword) => {
      //create a new user 
      const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
      })
      //save the user
      await newUser.save();
      //return success message if the user is added to the database successfully
      res.status(201).json({
        message: 'User created successfully',
        result: newUser,
      });
    })
    //catch  error if the new user is not added to the database successfully or if the password is not hashed successfully
    .catch (error => {
      res.status(500).json({
        message: 'Error',
        error: error.message,
      });
    })
});

app.get

module.exports = app;