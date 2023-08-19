const express = require("express");
const User = require("./../models/User");
const router = express.Router();

//password handler
const bcrypt = require("bcryptjs");
const run = require("../config/db");
export default async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
  
    if (
      name == "" ||
      email == "" ||
      password == "" 
    ) {
      res.json({
        status: "FAILED",
        message: "Empty input fields",
      }).status(400);;
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      res.json({
        status: "FAILED",
        message: "Invalid name entered",
      }).status(400);;
    } else if (
      /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      res.json({
        status: "FAILED",
        message: "Invalid Email entered",
      }).status(400);;
    } else if (password.length < 8) {
      res.json({
        status: "FAILED",
        message: "Password is too short!",
      }).status(400);;
    } else {
      //checking if already exists
      run.run().catch(console.dir)
      User.find({ email })
        .then((result) => {
          if (result.length) {
            //user already exists
            res.json({
              status: "FAILED",
              message: "User with this Email already exist",
            }).status(400);;
          } else {
            //password handling
            const saltRounds = 10;
            bcrypt
              .hash(password, saltRounds)
              .then((hashedPassword) => {
                const newUser = new User({
                  name,
                  email,
                  password: hashedPassword,
                });
                newUser
                  .save()
                  .then((result) => {
                      run.stop().catch(console.dir);
                    res.json({
                      status: "Success",
                      message: "Sign-up successfull",
                      data: result,
                    }).status(200);;
                  })
                  .catch((err) => {
                    res.json({
                      status: "FAILED",
                      message: err.message,
                    }).status(400);;
                  });
              })
              .catch((err) => {
                res.json({
                  status: "FAILED",
                  message: err.message,
                }).status(400);;
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: "FAILED",
            message: "An error occured while checking for user!",
          });
        });
    }
}