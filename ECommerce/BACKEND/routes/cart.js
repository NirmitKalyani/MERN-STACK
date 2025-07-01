const express = require("express");
const router = express.Router();

const{
    handleGetCart,
    handleAddToCart,
    handleUpdatedCart,
    handlePayment,
} = require("../Controller/cart");

router.get("/",handleGetCart);
router.post("/add",handleAddToCart);
router.put("/update",handleUpdatedCart);
router.post("/payment",handlePayment);

module.exports = router;