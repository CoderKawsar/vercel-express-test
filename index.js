const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.otylb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const toolsCollection = client.db("manufacturer").collection("tools");

    app.get("/", (req, res) => {
      res.send("Yay!");
    });

    // GET all tools data
    app.get("/tools", async (req, res) => {
      const total = parseInt(req.query.total);
      const query = {};
      const options = {
        sort: { _id: -1 },
      };
      const cursor = toolsCollection.find(query, options);
      let result;
      if (total) {
        result = await cursor.limit(total).toArray();
      } else {
        result = await cursor.toArray();
      }
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`App is listening on port `, port);
});
