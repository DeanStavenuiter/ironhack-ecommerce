const express = require('express');
const router = express.Router();
const { isAdmin, isLoggedIn } = require('../middleware/route-guard');
const ProductModel = require("../models/Product.model");


// get route admin panel
router.get("/",isLoggedIn , isAdmin, (req, res) => {
  res.render("admin/panel", {layout: "../views/layout-admin.ejs"});
});

// get route create new product
router.get("/create",isLoggedIn, isAdmin , (req, res) => {
    res.render("admin/create");
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