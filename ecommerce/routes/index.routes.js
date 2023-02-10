const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

// get route home page
router.get("/", (req, res) => {
  console.log(req.session.user)
  res.render("index", {user: req.session.user});
});

// get route profile page
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", {user: req.session.user} );
});

// get route checkout page
router.get("/checkout", isLoggedIn, (req, res) => {
  res.render("checkout", {user: req.session.user});
});

// post route check page
router.post("/checkout", isLoggedIn, (req, res) => {
  res.redirect("/success", {user: req.session.user})
})

module.exports = router;

