const express = require("express");
const router = express.Router();

const{
    handleGetCart,
    handleAddToCart,
    handleUpdatedCart,
} = require("../Controller/cart");

router.get("/",handleGetCart);
router.post("/add",handleAddToCart);
router.put("/update",handleUpdatedCart)

module.exports = router;