const UserModel = require("../models/User.model");

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

const isLoggedInCart = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/not-logged-in");
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.session.user.isAdmin === false) {
    return res.redirect("/");
  }
  next();
};

const addressComplete = async (req, res, next) => {
  const user = await UserModel.findById(req.session.user.id)
  if (!user.address.complete) {
    return res.redirect("/checkout/register");
  }
  next();
};

// We make updateAddress a middleware function that can be called onto different routes
const updateAddress = async (req, res, next) => {
  const address = { ...req.body };
  for (let property in address) {
    if (typeof property === "undefined") {
      res.render("profile", {
        user: req.session.user,
        error: "All the fields are required. Please fill in the missing ones.",
      });
    } else {
      address.complete = true;
      const sessUser = req.session.user.id;
      const query = { _id: sessUser };
      try {
        const foundUser = await UserModel.findOneAndUpdate(query, {
          address: address,
        });
        await foundUser.save();
        next();
      } catch (error) {
        console.log("There was an error updating the user's infos.", error);
      }
    }
  }
};

const updateCart = async (req, res, next) => {
  const itemAmountForm = req.body.amount;
  const itemIdForm = req.body.id;
  const sessUser = req.session.user.id;
  try {
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
    const updatedUser = await UserModel.findOne(query).populate("cart.product");
    await updatedUser.save();

    req.session.cart = [...updatedUser.cart];

    if (req.body.cartOpen) {
      req.session.open = true;
    }

    next();
  } catch (error) {
    console.log("There was an error updating the cart quantity", error);
  }
};

const addCart = async (req, res, next) => {
  const itemIdForm = req.body.id;
  const sessUser = req.session.user.id;
  // mongoose
  const query = { _id: sessUser };

  try {
    // We check if somebody clicked on the "Add to cart" button
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
      );
    } else {
      // otherwise we fetch the item that matches the item's ID and we just increase the amount property
      await UserModel.findOneAndUpdate(
        query,
        { $inc: { "cart.$[item].amount": 1 } },
        { arrayFilters: [{ "item.product": { $eq: itemIdForm } }] }
      );
    }
    // We force the amount to be always 10 or below
    await UserModel.findOneAndUpdate(
      query,
      { $set: { "cart.$[item].amount": 10 } },
      { arrayFilters: [{ "item.amount": { $gt: 10 } }] }
    );

    const updatedUser = await UserModel.findOne(query).populate("cart.product");
    await updatedUser.save();

    // link the session cart to the user cart in the DB
    req.session.cart = [...updatedUser.cart];

    if (req.body.cartOpen) {
      req.session.open = true;
    }

    next();
  } catch (error) {
    console.log("There was a problem adding something to the cart!", error);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdmin,
  addressComplete,
  updateAddress,
  isLoggedInCart,
  addCart,
  updateCart,
};
