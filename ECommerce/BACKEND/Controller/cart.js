const jwt = require("jsonwebtoken");
const { Product } = require("../models/Product");
const { User } = require("../models/User");
const { Cart } = require("../models/Cart");
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

    const product = await Product.findById({ _id: id });
    let cart = await Cart.findById({ _id: user.cart.id });
    if (cart) {
      // const old_cart = await Cart.findByIdAndUpdate(id,{$set:{quantity}});
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

module.exports = {
  handleGetCart,
  handleAddToCart,
};
