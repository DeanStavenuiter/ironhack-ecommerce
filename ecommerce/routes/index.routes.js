const express = require("express");
const { isLoggedIn } = require("../middleware/route-guard");
const router = express.Router();
const UserModel = require('../models/User.model');

// get route home page
router.get("/", (req, res) => {
  res.render("index", { user: req.session.user});
});

// get route profile page
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// get route checkout page
router.get("/checkout", isLoggedIn, async (req, res) => {
  const user = await UserModel.findOne({email: req.session.user.email}).populate("cart.product")
  res.render("checkout", { user });
});

// post route check page
// router.post("/checkout", isLoggedIn, (req, res) => {
//   res.redirect("/success", { user: req.session.user });
// });

module.exports = router;
