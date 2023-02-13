const express = require("express");
const { isLoggedIn } = require("../middleware/route-guard");
const router = express.Router();
const UserModel = require("../models/User.model");

// get route home page
router.get("/", (req, res) => {
  let cartOpen = false;
  let cart = req.session.user.cart;
  res.render("index", { user: req.session.user, cart, cartOpen });
});

// get route profile page
router.get("/profile", isLoggedIn, (req, res) => {
  let cartOpen = false;
  let cart = req.session.user.cart;
  res.render("profile", { user: req.session.user, cart, cartOpen });
});

// get route checkout page
router.get("/checkout", isLoggedIn, async (req, res) => {
  let cartOpen = false;
  let cart = req.session.user.cart;
  const user = await UserModel.findOne({
    email: req.session.user.email,
  }).populate("cart.product");
  res.render("checkout", { user, cart, cartOpen });
});

// post route check page
// router.post("/checkout", isLoggedIn, (req, res) => {
//   res.redirect("/success", { user: req.session.user });
// });

module.exports = router;
