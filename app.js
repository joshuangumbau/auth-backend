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

//endpoint to get the user from the database with the id 
app.get ('retrieveuser/:id', async (reg, res) => {
  try
  {
    //find the user by the id 
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //return the user if the user is found
    res.status(200).json({
      message: 'User retrieved successfully',
      result: user,
    });
  }
  catch (error) {
    //catch an error if the user is not found 
    res.status(500).json({
      message: 'error',
      error: error.message,
    });
  }
})

module.exports = app;