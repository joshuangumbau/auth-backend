const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth = require("./auth");


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

//allowing the frontend user to consume api using cors errors
//curb cores error by adding a header here

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow_origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"

  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET ,POST, PUT, DELETE, PATCH, OPTIONS "
  );
  next();
});

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

// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});
 // protecting the endpoint 
 //free endpoint

 app.get("/free-endpoint", (request, response) => {
  response.json({ message: "you are free to authorize me anytime"});
 });

 // authentication endpoint
 app.get("/auth-endpoint", auth, (request, response) => {
  response.json({message: "you are authorized to access me"});
 });

module.exports = app;