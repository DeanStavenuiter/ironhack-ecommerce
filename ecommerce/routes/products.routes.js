const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/route-guard');
const UserModel = require('../models/User.model');
const ProductModel = require("../models/Product.model");

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
  const user = await UserModel.findOne({email: req.session.user.email}).populate("cart.product")
  res.render("products/cart", {user})
})

// post route to add to cart
router.post("/cart-add", async (req, res) =>{
  const allProducts = await ProductModel.find()
  const itemIdForm = req.body.id
  const sessUser = req.session.user.email

  // mongoose
  const query = {email: sessUser}
  const foundUser = await UserModel.findOne(query)

  await foundUser.populate("cart.product")

  const itemExists = foundUser.cart.some((item) => {
    const stringID = JSON.stringify(item.product._id).split(`"`)[1]
    return stringID === itemIdForm
  })

  // Holy moly code
  if (!itemExists) {
    await UserModel.findOneAndUpdate(query, {"$push": {"cart": {product: itemIdForm}}}, {new: true})
  } else {
    await UserModel.findOneAndUpdate(query, {"$inc": {"cart.$[item].amount": 1}}, {arrayFilters: [{"item.product": {"$eq": itemIdForm}}]})
  }

  // link the session cart to the user cart in the DB
  req.session.user.cart = [...foundUser.cart]

  res.render("products/all-products", { allProducts, user: req.session.user })
})

router.post("/cart-delete", async (req, res) =>{
  const itemClicked = req.body.id
  const userClick = req.session.user.email

  // we find the user by email (subject to change) and update the cart property by pushing with mongoose syntax
  const foundUser = await UserModel.findOneAndUpdate({email: userClick}, {"$pull": {"cart": {product: itemClicked}}}, {new: true})

  // link the session cart to the user cart in the DB
  req.session.user.cart = [...foundUser.cart]

  res.redirect("/products/cart")
})


module.exports = router