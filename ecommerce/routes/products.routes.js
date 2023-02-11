const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const ProductModel = require("../models/Product.model");
const UserModel = require('../models/User.model');

// get route all products page
router.get("/", async (req, res) => {
  const allProducts = await ProductModel.find()
  console.log(allProducts[0].id)
  res.render("products/all-products", { allProducts, user: req.session.user } );
});

// get route single product page
router.get("/details/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId);
  console.log(product)
  res.render("products/single-product", { product, user: req.session.user });
});

// get route to display the cart
router.get("/cart", isLoggedIn, async (req, res) =>{
  const user = await UserModel.findOne({email: req.session.user.email}).populate("cart")
  res.render("products/cart", { user } )
})

// post route to add to cart
router.post("/cart", isLoggedIn, async (req, res) =>{
  const allProducts = await ProductModel.find()
  const itemClicked = req.body.id
  const userClick = req.session.user.email

  // we find the user by email (subject to change) and update the cart property by pushing with mongoose syntax
  const foundUser = await UserModel.findOneAndUpdate({email: userClick}, {"$push": {"cart": itemClicked}}, {new: true})

  // link the session cart to the user cart in the DB
  req.session.user.cart = [...foundUser.cart]

  res.render("products/all-products", { allProducts, user: req.session.user })
})


module.exports = router;