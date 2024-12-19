const express = require("express");
const router = express.Router();
const ShopController = require('../controllers/Shop');
const SecurityRoute = require("../controllers/security/Is-Auth");

router.get("/", ShopController.getIndex);

router.get("/Products", ShopController.getShop);

// db.execute("SELECT price FROM products where (price = 99.99)")      
//   .then((result) => {
//     console.log(result[0]);
//   })
//   .catch((err) => {
//     console.log(err); 
//   });

router.get("/product/:productId", ShopController.getProduct); 

router.get("/cart", SecurityRoute, ShopController.getCart); 

router.post("/cart", SecurityRoute, ShopController.postCart);

router.post("/delete-cart_Item", SecurityRoute, ShopController.DeleteCart);

// router.get("/orders", ShopController.getOrders);

// router.get("/chekout", ShopController.getChekout);

module.exports = router;
