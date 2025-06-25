const express = require("express");
const userRoutes = require("./user");
const productRoutes = require("./product");
const cartRoutes = require("./cart")

const router = express.Router();

router.use("/user",userRoutes);
router.use("/product",productRoutes);
router.use("/cart",cartRoutes);

module.exports = router;