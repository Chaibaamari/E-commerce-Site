// const fs = require("fs");
// const path = require("path");
// const pathRoot = require("../util/path");
const mongodb = require('mongodb')
const getDB = require('../util/database').getDB;
// const p = path.join(pathRoot, "data", "cart.json");


module.exports = class Cart {

    static AddToCart(product) {
        const db = getDB();
        // check exi
    }
















    // static AddToCart(Id , price) {
    //     fs.readFile(p, (err, fileContent) => {
    //         // reach the product 
    //         let cart = {
    //             products: [],
    //             TotalPrice: 0
    //         }
    //         if (!err) {
    //             cart = JSON.parse(fileContent);
    //         }
    //             //analyse the excistence of product
    //             const prodIndex = cart.products.findIndex((p) => p.Id === Id);
    //             let updatedProduct;
    //             if(prodIndex !== -1) {
    //                 updatedProduct = { ...cart.products[prodIndex] };
    //                 updatedProduct.quantity += 1;
    //                 cart.products = [...cart.products];
    //                 cart.products[prodIndex] = updatedProduct;
    //             } else {
    //                 updatedProduct = {Id : Id , quantity : 1}
    //                 cart.products = [...cart.products, updatedProduct];
    //             }
    //             cart.TotalPrice += +price;
    //         fs.writeFile(p, JSON.stringify(cart), (err) => {
    //             console.log(err)
    //         })
    //     })
    // }
} 
