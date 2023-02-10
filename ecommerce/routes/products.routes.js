const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const ProductModel = require("../models/Product.model");
const UserModel = require('../models/User.model');

// get route all products page
router.get("/", async (req, res) => {
  const user = req.session.user
  const allProducts = await ProductModel.find()
  res.render("products/all-products", { allProducts, user} );
});

// get route single product page
router.get("/details/:id", (req, res) => {
  res.render("products/single-product");
});

// get route to display the cart
router.get("/cart",isLoggedIn, async (req, res) =>{
  const user = await UserModel.findOne({email: req.session.user.email}).populate("cart")
  console.log(user)
  res.render("products/cart", {user})
})

// post route to add to cart
router.post("/cart", async (req, res) =>{
  const allProducts = await ProductModel.find()
  const itemClicked = req.body.id
  const user = req.session.user
  const userClick = req.session.user.email

  // we find the user by email (subject to change) and update the cart property by pushing with mongoose syntax
  const foundUser = await UserModel.findOneAndUpdate({email: userClick}, {"$push": {"cart": itemClicked}}, {new: true})

  // link the session cart to the user cart in the DB
  req.session.user.cart = [...foundUser.cart]

  res.render("products/all-products", { allProducts}, {user})
})


module.exports = router;