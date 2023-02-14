const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedInCart } = require("../middleware/route-guard");
const UserModel = require("../models/User.model");
const ProductModel = require("../models/Product.model");

let cartOpen = false;

// get route all products page
router.get("/", async (req, res, next) => {
  let cart = req.session.cart;
  
  const allProducts = await ProductModel.find();

  res.render("products/all-products", {
    allProducts,
    user: req.session.user,
    cart,
    cartOpen,
  });

  next()
}, () =>{
  cartOpen = false;
});

// get route single product page
router.get("/details/:id", async (req, res) => {
  let cart = req.session.cart;

  const productId = req.params.id;
  const product = await ProductModel.findById(productId);
  res.render("products/single-product", {
    product,
    user: req.session.user,
    cart,
    cartOpen,
  });
});

// get route to display the cart

router.get("/cart", isLoggedIn, async (req, res) => {
  // let cart = req.session.cart;

  const user = await UserModel.findOne({
    email: req.session.user.email,
  }).populate("cart.product");

  res.render("products/cart", { user, cartOpen });
});

// post route to add to cart
router.post("/cart-add", isLoggedInCart, async (req, res) => {
  // We check if somebody clicked on the "Add to cart" button
  if (req.body.cartOpen) {
    cartOpen = true;
  }

  const itemIdForm = req.body.id;
  const sessUser = req.session.user.id;
  console.log(req.session.user)
  // mongoose
  const query = { _id: sessUser };

  const foundUser = await UserModel.findOne(query);
  await foundUser.populate("cart.product");

  // We check if there's any items in the user's cart that matches the ID that comes with the request
  const itemExists = foundUser.cart.some((item) => {
    const stringID = JSON.stringify(item.product._id).split(`"`)[1];
    return stringID === itemIdForm;
  });

  // itemExists is either going to be true or false
  if (!itemExists) {
    // If there's no item matching the item that comes with the request, we push the item into the user's cart
    await UserModel.findOneAndUpdate(
      query,
      { $push: { cart: { product: itemIdForm } } },
      { new: true }
    )
  } else {
    // otherwise we fetch the item that matches the item's ID and we just increase the amount property
    await UserModel.findOneAndUpdate(
      query,
      { $inc: { "cart.$[item].amount": 1 } },
      { arrayFilters: [{ "item.product": { $eq: itemIdForm } }] }
    )
  }

  // We force the amount to be always 10 or below
  await UserModel.findOneAndUpdate(
    query,
    { $set: { "cart.$[item].amount": 10 } },
    { arrayFilters: [{ "item.amount": { $gt: 10 } }] }
  );

  const updatedUser = await UserModel.findOne(query).populate("cart.product")
  await updatedUser.save()

  // link the session cart to the user cart in the DB
  req.session.cart = [...updatedUser.cart];
console.log(req.session)
  res.redirect("/products");
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

  // link the session cart to the user cart in the DB
  req.session.cart = [...foundUser.cart];

  res.redirect("/products/cart");
});

// post route to update the cart
router.post("/cart-update", async (req, res) => {

  const itemAmountForm = req.body.amount;
  const itemIdForm = req.body.id;
  const sessUser = req.session.user.id;

  // mongoose
  const query = { _id: sessUser };
  const foundUser = await UserModel.findOne(query);
  await foundUser.populate("cart.product");
  await UserModel.findOneAndUpdate(
    query,
    { $set: { "cart.$[item].amount": itemAmountForm } },
    { arrayFilters: [{ "item.product": { $eq: itemIdForm } }] }
  );

  // link the session cart to the user cart in the DB
  const updatedUser = await UserModel.findOne(query).populate("cart.product")
  await updatedUser.save()

  req.session.cart = [...updatedUser.cart];

  res.redirect("/products/cart");
});

module.exports = router;
