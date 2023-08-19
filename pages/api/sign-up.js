const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);
//password handler
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});
  
async function run() {
    try {
      console.log("inside db")
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
    
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      return Math.random();
    } catch(e){
        console.error(e)
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

async function stop() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.close();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

//password handler
const bcrypt = require("bcryptjs");
const run = require("../../config/db");
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
      let connection = run();
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
        connection&&stop();
        return res;
    }
}