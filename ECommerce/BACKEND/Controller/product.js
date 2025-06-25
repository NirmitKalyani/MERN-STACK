const {Product} = require("../models/Product");
const {User} = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function handleGetProducts(req,res) {
    try{
        const products = await Product.find({});
        res.send({products,});
    }catch(error){
        console.log(error)
        res.status(500).send({
            msg:"interna; server error",
            error,
        });
    }
}

async function handleAddProduct(req,res) {
    try{
        let{name,price,image,description,brand,stock} = req.body;
        console.log(req.headers)
        let{token} = req.headers;
        let decodeToken = jwt.verify(token,"secretkey");
        let user = await User.findOne({email:decodeToken.email});

        const product = await Product.create({
            name,
            price,
            image,
            description,
            brand,
            stock,
            user:user._id
        });
        res.send({
            msg:"product added",
            product,
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg:"internal server error",
            error,
        })
    }
}

async function handleSingleProduct(req,res) {
    try{
        let{id} = req.params
        if(!id){
            return res.status(404).send("Not found");
        }
        let {token} = req.headers;
        const decodedToken = jwt.verify(token,"secretkey");
        const user = await User.findOne({email:decodedToken.email});

        if(user){
            const product = await Product.findOne({
                _id:id,
            })
            if(!product){
                res.status(404).json({
                    msg:"product not found"
                })
            }
    
            return res.status(200).json({
                msg:"product found successfully",
                product:product
            })    
        }

    }catch(error){
        console.log(error);
        res.status(500).send({
            msg:"internal server error",
            error,
        })
    }
}

async function handleUpdateProduct(req,res) {
    try{
        
        let{id} = req.params;
        let{name, price, image, description, stock, brand} = req.body;
        let{token} = req.headers;
        const decodedToken = jwt.verify(token,"secretkey");
        const user = await User.findOne({email:decodedToken.email});
        if(user){
            const productUpdated = await Product.findByIdAndUpdate(id,{
                name,
                price,
                brand,
                description,
                image,
                stock
            });
            res.status(200).send({
                msg:"Product Updated successfully",
                product:productUpdated
            })    
        }

    }catch(error){
        console.log(error);
        res.status(500).send({
            msg:"internal server error",
            error,
        })
    }
}

async function handleDeleteProduct(req,res) {
    try{
        let{id} = req.params;
        let{token} = req.headers;
        const decodedToken = jwt.verify(token,"secretkey");
        const user = await User.findOne({email:decodedToken.email});
        if(user){
            const productDeleted = await Product.findByIdAndDelete({_id:id});
            res.status(200).send({
                msg:"Product Deleted successfully",
                product:productDeleted
            })    
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg:"internal server error",
            error,
        })
    }   
}

module.exports = {
    handleAddProduct,
    handleGetProducts,
    handleSingleProduct,
    handleUpdateProduct,
    handleDeleteProduct,
}