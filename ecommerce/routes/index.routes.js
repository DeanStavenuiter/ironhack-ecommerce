const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

// get route home page
router.get("/", (req, res) => {
  res.render("index");
});

// get route profile page
router.get("/profile", isLoggedIn, (req, res) => {


  res.render("profile", {user: req.session.user} );
});

// get route checkout page
router.get("/checkout", isLoggedIn, (req, res) => {
  res.render("checkout");
});

// post route check page
router.post("/checkout", isLoggedIn, (req, res) => {
  res.redirect("/success")
})

module.exports = router;

