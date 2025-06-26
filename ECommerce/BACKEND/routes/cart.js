const express = require("express");
const router = express.Router();

const{
    handleGetCart,
    handleAddToCart,
} = require("../Controller/cart");

router.get("/",handleGetCart);
router.post("/add",handleAddToCart);

module.exports = router;