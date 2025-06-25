const jwt = require("jsonwebtoken");
const {Product} = require("../models/Product");
const {User} = require("../models/User");
const {Cart} = require("../models/Cart");

async function handleGetCart(req,res) {
    try{
        const{token} = req.headers;
        console.log(token)
        if(!token){
            res.status(404).json({
                msg:"User not logged in",
            });
        }
        const decodeToken = jwt.verify(token,"secretkey");
        const user = await User.findOne({email:decodeToken.email}).populate({
            path:'cart',
            populate:{
                path:'products',
                model:'Product'
            }
        });
        if(!user){
            res.status(404).json({
                msg:"User not found",
            });
        }
        res.status(200).json({
            msg:"cart created successfully",
            data:user.cart
        });

    }catch(error){
        console.log(error)
        res.status(500).send({
            msg:"interna; server error",
            error,
        });
    }
}
module.exports = {
    handleGetCart,
}