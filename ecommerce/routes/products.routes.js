const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const ProductModel = require("../models/Product.model");
const UserModel = require('../models/User.model');

// get route all products page
router.get("/", async (req, res) => {
  const allProducts = await ProductModel.find()
  res.render("products/all-products", { allProducts } );
});

// get route single product page
router.get("/details/:id", (req, res) => {
  res.render("products/single-product");
});

// get route to display the cart

router.get("/cart", isLoggedIn, async (req, res) =>{
  const user = await UserModel.findOne({email: req.session.user.email}).populate("cart.product")
  res.render("products/cart", {user})
})

// post route to add to cart
router.post("/cart-add", async (req, res) =>{
  const allProducts = await ProductModel.find()
  const itemClicked = req.body.id
  const userClick = req.session.user.email

  // mongoose
  const query = {email: userClick}
  const foundUser = await UserModel.findOne(query)

  // we find the user by email (subject to change) and update the cart property by pushing with mongoose syntax

  await foundUser.populate("cart.product")
  
  // foundUser.cart.forEach(element => {
  //   const stringID = JSON.stringify(element.product._id).split(`"`)[1]
  //   console.log(stringID, itemClicked)
  //   if (stringID === itemClicked || foundUser.cart.length === 0) {
  //     console.log("Duplicate")
  //   }
  //   else {
  //     console.log("Not a Duplicate")
  //   }
  // })

  const itemExists = foundUser.cart.find(item => {
    const stringID = JSON.stringify(item.product._id).split(`"`)[1]
    console.log(stringID, itemClicked)
    if (stringID === itemClicked) {
      return true
    }
    else {
      return false
    }
  })

  console.log(foundUser)

  if(itemExists) {
    await UserModel.findOneAndUpdate(query, {"$set": {"cart."}} )
  }else {
    await UserModel.findOneAndUpdate(query, {"$push": {"cart": {product: itemClicked}}}, {new: true})
    req.session.user.cart = [...foundUser.cart]
  }
  
  res.render("products/all-products", { allProducts })

  // link the session cart to the user cart in the DB
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


module.exports = router;