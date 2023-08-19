const { run, stop } = require("../config/db");
const User =  require("../models/User")
const bcrypt = require("bcryptjs");



export default async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (email == "" || password == "") {
      res.json({
        status: "FAILED",
        message: "Empty credentials given",
      }).status(400);
    } else {
      //checking for users
      let connection = run();
      User.find({ email })
        .then((data) => {
          if (data) {
            //user exists
            const hashedPassword = data[0].password;
            bcrypt
              .compare(password, hashedPassword)
              .then((result) => {
                if (result) {
                  //password matches
                  res.json({
                    status: "SUCCESS",
                    message: "Sign in successful",
                    data: data,
                  }).status(200);;
                } else {
                  res.json({
                    status: "FAILED",
                    message: "Invalid Password",
                  }).status(400);;
                }
              })
              .catch((err) => {
                res.json({
                  status: "FAILED",
                  message: err.message,
                }).status(500);;
              });
          } else {
            res.json({
              status: "FAILED",
              message: "Invalid credential",
            }).status(400);;
          }
        })
        .catch((err) => {
          res.json({
            status: "FAILED",
            message: err.message,
          }).status(500);;
        });
        connection && stop();
        return res;
    }
  };