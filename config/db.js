const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
  console.log(uri)
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

  
module.exports = {run, stop};