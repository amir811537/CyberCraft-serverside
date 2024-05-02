const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
// midewaare
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 5000;
// mongodb+srv://amirhossainbc75:<password>@cluster0.spkoynb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const uri = `mongodb+srv://amirhossainbc75:${process.env.DB_PASS}@cluster0.spkoynb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();



    // user collection
    const usercollection = client.db("CyberCraftDB").collection("user");

    //user related api post
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await usercollection.insertOne(user);
      res.send(result);
    });


 
//  pagination apis
    app.get('/user', async (req, res) => {
      const page = parseInt(req.query.page) || 1; 
// Number of documents per page
      const limit = 10; 
      // Calculate the number of documents to skip
      const skip = (page - 1) * limit; 
  
      try {
          const cursor = usercollection.find().skip(skip).limit(limit);
          const result = await cursor.toArray();
          res.send(result);
      } catch (error) {
          console.error('Error fetching user data:', error);
          res.status(500).send('Internal Server Error');
      }
  });
  
// get user by id if needed
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usercollection.findOne(query);
      res.send(result);
    });

   
    //  user delete
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usercollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});
