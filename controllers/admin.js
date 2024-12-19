const Product = require("../models/addProduct");

exports.getAddProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    PageTitle: "Products",
    path: "admin/add-product",
    editing: false,
    isAuth: req.session.LoggedIn,
  });
};

exports.PostProduct = (req, res, next) => {
  Product.findByIdAdmin(req.userB._id)
    .then((userAdmin) => { 
      if (!userAdmin) {
        return res.redirect("/Products");   
      }
      const product = new Product(
        req.body.title,
        req.body.price,
        req.body.description,
        req.body.imageUrl,
        null,
        req.userB._id
      );
      product.save().then(() => {
        res.redirect("/Products");
        console.log("Product Created"); 
      });
    })
    .catch((err) => console.log(err));
    
};

exports.EditProduct = (req, res, next) => {
  const editing = req.query.edit;
  console.log(editing)
  if (editing) {
    if (!editing) {
      return res.redirect("/");
    }
    const ProdId = req.params.productId;
    Product.findById(ProdId)
      .then((product) => { 
        if (product.userId.toString() === req.userB._id.toString()) {
          res.render("admin/edit-product", {
            PageTitle: "Products",
            path: "admin/edit-product",
            product: product,
            editing: true,
            isAuth: req.session.LoggedIn,
          });
        } else {
          return res.redirect('/')
        }
      })
      .catch((err) => console.log(err));
  }
};

exports.getNewProducts = (req, res, next) => {
  Product.fetchAllProducts(req.userB._id)
    .then((products) => {
      res.render("admin/products", {
        proud: products,
        PageTitle: "Products Admin",
        path: "admin/ProductAdmin",
        isAuth: req.session.LoggedIn,
      });
    })
    .catch(() => console.log("chaiiba error"));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const product = new Product(
    req.body.title,
    req.body.price, 
    req.body.description,
    req.body.imageUrl,  
    prodId 
  );   
  product 
    .save()
    .then(() => {
      res.redirect("/");
      console.log("Product Created");
    })
    .catch((err) => console.log(err));
};

exports.DeleteProduct = (req, res, next) => {
  const ProdId = req.body.prodId;
  Product.DeleteProductID(ProdId)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
