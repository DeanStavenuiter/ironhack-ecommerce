const express = require("express");
const { isLoggedIn, addressComplete } = require("../middleware/route-guard");
const router = express.Router();
const UserModel = require("../models/User.model");
const OrderModel = require("../models/Order.model");

// get route checkout page
router.get("/", isLoggedIn, addressComplete, async (req, res) => {
  const query = {_id: req.session.user.id}
  const user = await UserModel.findOne(query).populate("cart.product");
  res.render("checkout/checkout", { user });
});

router.get("/register", isLoggedIn, async (req, res) => {
  const query = {_id: req.session.user.id}
  const user = await UserModel.findOne(query).populate("cart.product");
  res.render("checkout/checkout-register", { user });
});

router.post("/success", async (req, res) => {
  const owner = req.session.user.id
  const productsIDs = []
  req.session.cart.forEach(item => productsIDs.push(item.product))
  const order = {owner: owner, products: productsIDs, totalPrice: req.body.subtotal}
  try {
    await OrderModel.create(order)
    res.send("Congratulations")
  } catch (error) {
    console.log("There was an error creating the order", error)
  }
  });

module.exports = router;
