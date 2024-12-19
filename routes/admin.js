const path = require("path");
const express = require("express");
const ProductsController = require("../controllers/admin"); 
const SecurityRoute = require('../controllers/security/Is-Auth')
const router = express.Router();

// /admin/add-product => GET
router.get("/add-product",SecurityRoute, ProductsController.getAddProducts);    


// /admin/add-product => POST 
router.post("/add-product", SecurityRoute, ProductsController.PostProduct); 

router.get("/edit-product/:productId",SecurityRoute, ProductsController.EditProduct)

router.get("/ProductAdmin", SecurityRoute, ProductsController.getNewProducts); 

router.post("/edit-product", SecurityRoute, ProductsController.postEditProduct);

router.post("/delete-product", SecurityRoute, ProductsController.DeleteProduct);

module.exports = router; 
