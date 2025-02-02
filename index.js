const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app=express();
const port= process.env.PORT || 5000;

// MiddleWare
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ptiwh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection=client.db('product_DB').collection('products')
    const cartCollection=client.db('product_DB').collection('carts')


    app.get("/products",async(req,res)=>{
        const cursor=productCollection.find();

        const result= await cursor.toArray();
        res.send(result)
        
    })

    // app.get('/reviews/:id',async(req,res)=>{
    //   const id = req.params.id;
    //   const query = {_id: new ObjectId(id)}
    //   const result=await reviewCollection.findOne(query)
    //   res.send(result)
    // })


  
    app.post("/products",async(req,res)=>{
        const newProduct=req.body;
        const result= await productCollection.insertOne(newProduct)
        res.send(result)
        
    })
    app.post("/carts",async(req,res)=>{
        const cartItem=req.body;
        const result= await cartCollection.insertOne(cartItem)
        res.send(result)
        
    })
    app.get("/carts",async(req,res)=>{
      const cursor=cartCollection.find();

      const result= await cursor.toArray();
      res.send(result)
      
  })

   







    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Products Server Working properly')
})

app.listen(port,()=>{
    console.log(`Server Running on port${port}`);
})