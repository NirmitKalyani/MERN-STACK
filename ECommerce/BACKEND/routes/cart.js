const express = require("express");
const router = express.Router();

const{
    handleGetCart,
} = require("../Controller/cart");

router.get("/",handleGetCart);

module.exports = router;