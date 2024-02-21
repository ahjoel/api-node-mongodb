const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel')
require("dotenv").config();
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: false}))

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173/");
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const port = process.env.PORT || 4000;  // Read from .env if not available then defaults to 4000

const mongo_url = process.env.MONGO_URL;
// routes
app.get('/', (req, res) => {
    res.send('Hello NODE API')
})

app.get('/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message: error.message})   
    }
    // res.send('Hello blog, My Name is Cysboy')
})

app.get('/products/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})   
    }
})

app.post('/product', async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

app.put('/products/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (!product) {
            return res.status(404).json({message: `cannot find any prpduct with ID ${id}`})
        }
        const updateProduct = await Product.findById(id)
        res.status(200).json(updateProduct);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete('/products/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({message: `cannot find product with ID ${id}`})
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.connect(mongo_url)
.then(()=> {
    console.log('connected to MongoDB');
    app.listen(port, ()=> {
        console.log(`Node API is running on port ${port}`);
    })
}).catch((error)=> {
    console.log(error);
})