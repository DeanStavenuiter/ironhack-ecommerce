const express = require("express");
const router = express.Router();
const {
  isLoggedIn,
  isLoggedInCart,
  addCart,
  updateCart,
} = require("../middleware/route-guard");
const UserModel = require("../models/User.model");
const ProductModel = require("../models/Product.model");

let cartOpen = false;

// get route all products page
router.get("/", async (req, res, next) => {
  let allProducts = {};
  if (req.session.open) {
    cartOpen = true
  } else {
    cartOpen = false
  }

  let priceQuery = 0;
  if (req.query.price == 0) {
    priceQuery = 9999;
  } else {
    priceQuery = req.query.price;
  }

  // If there's no filter and the query is empty we want to display all the products in the DB
  if (Object.keys(req.query).length === 0) {
    allProducts = await ProductModel.find();
  }
  // Otherwise we apply the filter queries
  else {
    const query = {
      $and: [
        { type: { $in: req.query.type } },
        { price: { $lte: priceQuery } },
      ],
    };
    allProducts = await ProductModel.find(query);
  }

  const user = await UserModel.findById(req.session.user.id).populate(
    "cart.product"
  );
  delete req.session.open
  res.render("products/all-products", {allProducts, user: req.session.user, cart: user.cart, cartOpen});
});

// get route single product page
router.get("/details/:id", async (req, res) => {
  if (req.session.open) {
    cartOpen = true
  } else {
    cartOpen = false
  }

  const productId = req.params.id;
  const product = await ProductModel.findById(productId);
  try {
    const user = await UserModel.findById(req.session.user.id).populate(
      "cart.product"
    );
    delete req.session.open
    res.render("products/single-product", {product, user: req.session.user, cart: user.cart, cartOpen});
  } catch (error) {
    let cart = req.session.cart;
    res.render("products/single-product", {product, user: req.session.user, cart, cartOpen});
  }
});

// get route to display the cart

router.get("/cart", isLoggedIn, async (req, res) => {

    const user = await UserModel.findOne({
      email: req.session.user.email,
    }).populate("cart.product");

    res.render("products/cart", { user });
  },
);

// post route to add to cart
router.post("/cart-add", isLoggedInCart, addCart, async (req, res) => {
  res.redirect(`${req.headers.referer}`);
});

router.post("/cart-delete", async (req, res) => {
  const itemClicked = req.body.id;
  const userClick = req.session.user.email;

  // we find the user by email (subject to change) and update the cart property by pushing with mongoose syntax
  const foundUser = await UserModel.findOneAndUpdate(
    { email: userClick },
    { $pull: { cart: { product: itemClicked } } },
    { new: true }
    );

    if (req.body.cartOpen) {
      req.session.open = true;
    }

    req.session.cart = [...foundUser.cart];   
  
  // link the session cart to the user cart in the DB
  res.redirect(`${req.headers.referer}`);
});

// post route to update the cart
router.post("/cart-update", updateCart, async (req, res) => {
  res.redirect(`${req.headers.referer}`);
});

module.exports = router;
