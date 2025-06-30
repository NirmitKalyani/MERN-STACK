const jwt = require("jsonwebtoken");
const { Product } = require("../models/Product");
const { User } = require("../models/User");
const { Cart } = require("../models/Cart");
const sendEmail = require("../utils/userEmail");

async function handleGetCart(req, res) {
  try {
    const { token } = req.headers;
    console.log(token);
    if (!token) {
      res.status(404).json({
        msg: "User not logged in",
      });
    }
    const decodeToken = jwt.verify(token, "secretkey");
    const user = await User.findOne({ email: decodeToken.email }).populate({
      path: "cart",
      populate: {
        path: "products",
        model: "Product",
      },
    });
    if (!user) {
      res.status(404).json({
        msg: "User not found",
      });
    }
    res.status(200).json({
      msg: "cart created successfully",
      data: user.cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: "interna; server error",
      error,
    });
  }
}

async function handleAddToCart(req, res) {
  try {
    let price;
    const { token } = req.headers;
    let { id, quantity } = req.body;

    // console.log(token)
    if (!token) {
      res.status(404).json({
        msg: "User not logged in",
      });
    }
    const decodeToken = jwt.verify(token, "secretkey");
    const user = await User.findOne({ email: decodeToken.email });

    if (!user) {
      return res.send("User not logged in");
    }
    console.log(user)
    const product = await Product.findById(id);
    let cart;
    if(user.cart){
      cart = await Cart.findById(user.cart);
      if(!cart){
        cart = await Cart.create({
          products: [{ product: id, quantity }],
          total: product.price * quantity,
        });
        user.cart = cart._id;
        await User.save();
        return res.send("Item added to cart");
      }else{
        const exists = cart.products.some(
              (product) => product.product.toString() === id.toString()
            );
            if (exists) {
              return res.send("Item already exists...Go to cart");
            }
      
            cart.products.push({
              product: id,
              quantity,
            });
            cart.total += product.price * quantity;
            await cart.save();
      }
    // if (cart) {
    //   // const old_cart = await Cart.findByIdAndUpdate(id,{$set:{quantity}});
    //   
    } else {
      const new_cart = await Cart.create({
        products: [{ product: id, quantity }],
        total: product.price * quantity,
      });

      user.cart = new_cart._id;
      await user.save();

      if (!new_cart) {
        return res.send("Item not added...");
      }
      res.send({
        msg: "product added",
        product,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: "interna; server error",
      error,
    });
  }
}

async function handleUpdatedCart(req,res) {
  try{
    const { token } = req.headers;
    let { id, action } = req.body;

    // console.log(token)
    if (!token) {
      res.status(404).json({
        msg: "User not logged in",
      });
    }
    const decodeToken = jwt.verify(token, "secretkey");
    const user = await User.findOne({ email: decodeToken.email }).populate({
      path:"cart",
      populate:{
        path:"products.product",
        model:"product"
      }
    });

    if(!user || !user.cart){
      return res.status(404).send("Cart not found...");
    }

    const cart = user.cart;
    const item = cart.products.find(p=>p.product._id.toString()===id)    

    if(!item){
      return res.status(404).send("Product not found in cart...");
    }

    const price = item.product.price;

    if(action==="increase"){
      item.quantity += 1;
      cart.total += price;
    }else if(action==="decrease"){
      if(item.quantity>1){
        item.quantity -= 1;
        cart.total -= price;
      }else{
        cart.total -= price;
        cart.products = cart.products.filter(p=>p.product._id.toString()!==id);
      }
    }else if(action==="remove"){
        cart.total -= price*item.quantity;
        cart.products = cart.products.filter(p=>p.product._id.toString()!==id);
    }else{
      return res.status(400).send("Invalid Action...");
    }

    await cart.save();

    return res.status(200).send({
      msg:"Cart Updated...",
      cart
    });

  }catch(error) {
    console.log(error);
    res.status(500).send({
      msg: "interna; server error",
      error,
    });
  }
}

async function handleSendEmail(params) {
  
}

module.exports = {
  handleGetCart,
  handleAddToCart,
  handleUpdatedCart,
};
