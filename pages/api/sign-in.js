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
        connection &&stop();
        return res;
    }
  };