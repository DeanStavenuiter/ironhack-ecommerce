const express = require('express');
const router = express.Router();

// get route home page
router.get("/", (req, res) => {
  res.render("index");
});

// get route profile page
router.get("/profile", (req, res) => {
  res.render("profile");
});

// get route checkout page
router.get("/checkout", (req, res) => {
  res.render("checkout");
});

// post route check page
router.post("/checkout", (req, res) => {
  res.redirect("/success")
})

module.exports = router;

