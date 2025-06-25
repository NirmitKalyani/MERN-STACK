const express = require("express");
const{
    handleAddProduct,
    handleGetProducts,
    handleSingleProduct,
    handleUpdateProduct,
    handleDeleteProduct,
} = require("../Controller/product");

const router = express.Router();

router.get("/home",handleGetProducts);
router.post("/add-product",handleAddProduct);
router.get("/:id",handleSingleProduct);
router.put("/edit/:id",handleUpdateProduct);
router.delete("/delete/:id",handleDeleteProduct)

module.exports = router;