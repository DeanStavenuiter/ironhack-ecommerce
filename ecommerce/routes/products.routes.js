const express = require('express');
const router = express.Router();

// get route all products page
router.get("/", (req, res) => {
  res.render("products/all-products");
});

// get route single product page
router.get("/:id", (req, res) => {
  res.render("products/single-product");
});


module.exports = router;