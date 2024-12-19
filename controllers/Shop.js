const Product = require("../models/addProduct");
const Cart = require("../models/Cart");
const User = require("../models/User");


exports.getShop = (req, res, next) => {
    Product.fetchAll()  
        .then((product) => {
            res.render("shop/product-list", {
                proud: product,
                PageTitle: "shop",
                path: "/products",
                productCSS: true,
                ActiveCSS: true,
                isAuth: req.session.LoggedIn, 
            });
    })
}


exports.getIndex = (req, res, next) => {
    console.log(req.LoggedIn)
    Product.fetchAll()
        .then((products) => {
            res.render("shop/index", {
                proud: products, // Product.fetchAll() => null so null.lenght => probleme
                PageTitle: "shop",
                path: "/",
                productCSS: true,
                ActiveCSS: true,
                isAuth: req.session.LoggedIn,
            });
        })
};
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
        res.render("Shop/product-detail", { 
            path: "/product-detail",  
            product: product,
            PageTitle: "Product_Detail",
            isAuth : req.session.LoggedIn,
        }); 
    }).catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    // console.log(req.session.userB)
    req.userB.getCart().then((products) => {
        res.render("Shop/cart", {
            PageTitle: "ShopCart", 
            productsCart: products,
            TotalPrice : req.userB.getPrice(),
            path: "/cart",
            isAuth : req.session.LoggedIn,
        });
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then((product) => {
            return req.userB.AddToCart(product)
        })
        .then((result) => {
            res.redirect('/cart')
            return result;
        }).catch(() => {
            throw new Error('failed to update Cart')
        });
}

exports.DeleteCart = (req, res, next) => {
    const CartId = req.body.productCartId;
    const Qte = req.body.productCartqte;
        return req.userB.deleteCartItem(CartId , Qte)
            .then(() => {
            console.log('yes')
            res.redirect('/cart')
        }).catch(() => {
            console.log('chaiba none')
        });
}

exports.getOrders = (req, res, next) => {
    res.render("Shop/orders", {
        PageTitle: "your orders",
        path: "/orders",
        isAuth : req.session.LoggedIn,
    });
};

exports.getChekout = (req, res, next) => {
    res.render("Shop/chekout", {
        PageTitle: "chekout",
        path: "/chekout",
        isAuth : req.session.LoggedIn,
    });
};
