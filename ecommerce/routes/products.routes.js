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
    console.log(req.originalUrl)
    let allProducts = {}
    let priceQuery = 0
    if (req.query.price == 0) {
      priceQuery = 9999
    } else {
      priceQuery = req.query.price
    }
    
    if (Object.keys(req.query).length === 0) {
      allProducts = await ProductModel.find();
    } else {
      const query = {$and: [{type:  {$in: req.query.type}}, {price: {$lte: priceQuery}}]}
      allProducts = await ProductModel.find(query)
    }

    if (req.headers.referer === "http://localhost:3000/products" && req.originalUrl === "/products") {
      cartOpen = true;
    } else {
      cartOpen = false;
    }

    try {
      const user = await UserModel.findById(req.session.user.id).populate(
        "cart.product"
      );
      res.render("products/all-products", {
        currentURL: "http://localhost:3000/products",
        allProducts,
        user: req.session.user,
        cart: user.cart,
        cartOpen,
      });

      next();
    } catch (error) {
      let cart = req.session.cart;
      res.render("products/all-products", {
        allProducts,
        user: req.session.user,
        cart,
        cartOpen,
      });
    }
  },
  () => {
    cartOpen = false;
  }
);

// get route single product page
router.get("/details/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId);
  try {
    const user = await UserModel.findById(req.session.user.id).populate(
      "cart.product"
    );
    res.render("products/single-product", {
      product,
      user: req.session.user,
      cart: user.cart,
      cartOpen,
    });

    next();
  } catch (error) {
    let cart = req.session.cart;
    res.render("products/single-product", {
      product,
      user: req.session.user,
      cart,
      cartOpen,
    });
  }
});

// get route to display the cart

router.get(
  "/cart",
  isLoggedIn,
  async (req, res) => {
    // let cart = req.session.cart;

    const user = await UserModel.findOne({
      email: req.session.user.email,
    }).populate("cart.product");

    res.render("products/cart", { user, cartOpen });
  },
  () => {
    cartOpen = false;
  }
);

// post route to add to cart
router.post("/cart-add", isLoggedInCart, addCart, async (req, res) => {
  if (req.body.cartOpen) {
    cartOpen = true;
  }
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

  // link the session cart to the user cart in the DB
  req.session.cart = [...foundUser.cart];

  res.redirect(`${req.headers.referer}`);
});

// post route to update the cart
router.post("/cart-update", updateCart, async (req, res) => {
  cartOpen = true;

  res.redirect(`${req.headers.referer}`);
});

module.exports = router;
