const express = require("express");
const { isAdmin, isLoggedIn } = require("../middleware/route-guard");
const OrderModel = require("../models/Order.model");
const router = express.Router();
const ProductModel = require("../models/Product.model");
const UserModel = require("../models/User.model");

// get route admin panel
router.get("/", isLoggedIn, isAdmin, async (req, res) => {
  try {
    res.render("admin/panel", {
      layout: "../views/layout-admin.ejs",
      user: req.session.user,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log("There is an error with the admin panel", error);
  }
});

// get route create new product
router.get("/create", isLoggedIn, isAdmin, (req, res) => {
  res.render("admin/create", {
    layout: "../views/layout-admin.ejs",
    user: req.session.user,
    cart: req.session.cart,
  });
});

// post route to create new product
router.post("/create", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await ProductModel.create(req.body);
  } catch (error) {
    console.log(error);
  }

  res.redirect("/admin");
});

// get route all users page
router.get("/user-list", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const findAllUsers = await UserModel.find();
    const orderHistory = await OrderModel.find().populate(
      "owner products.product"
    );
    res.render("admin/user-list", {
      findAllUsers,
      orderHistory,
      user: req.session.user,
    });
  } catch (error) {
    console.log("There are some problems with loading all the users", error);
  }
});

//get route to a single user page
router.get("/user-list/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const findUser = await UserModel.findById(req.params.id);
    const findOrders = await OrderModel.find({ owner: req.params.id }).populate(
      "owner products.product"
    );
    res.render("admin/user-profile", {user: req.session.user, findUser, orderHistory: findOrders});
  } catch (error) {
    console.log("There was an error loading the user page", error);
  }
});

module.exports = router;
