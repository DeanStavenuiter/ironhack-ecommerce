const express = require('express');
const { isAdmin, isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const ProductModel = require("../models/Product.model");
const UserModel = require('../models/User.model');

// get route admin panel
router.get("/",isLoggedIn , isAdmin, async(req, res) => {
 try {
  const findAllUsers = await UserModel.find()
  res.render("admin/panel", {layout: "../views/layout-admin.ejs", user: req.session.user, cart: req.session.cart, findAllUsers});
 } catch (error) {
  
 }

});

// get route create new product
router.get("/create",isLoggedIn, isAdmin , (req, res) => {
    res.render("admin/create", {layout: "../views/layout-admin.ejs", user: req.session.user, cart: req.session.cart});
  });

// post route to create new product
router.post("/create",isLoggedIn, isAdmin, async(req, res) => {
  try {
    await ProductModel.create(req.body)
  } catch (error) {
    console.log(error)
  }

    res.redirect("/admin")
})

// get route all users page
// router.get("/user-list", (req, res) => {
//     res.render("/admin/user-list");
//   });


module.exports = router;