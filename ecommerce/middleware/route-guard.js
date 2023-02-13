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

const isAdmin = (req, res, next) => {
  if (req.session.user.isAdmin === false) {
    return res.redirect("/");
  }
  next();
};

const addressComplete = (req, res, next) => {
  if (typeof req.session.user.address === "undefined") {
    return res.redirect("/checkout/register");
  }
  next();
};


// We make updateAddress a middleware function that can be called onto different routes
const updateAddress = async (req, res, next) => {
  const address = { ...req.body};
  for (let property in address) {
    if (typeof property === "undefined") {
      res.render("profile", { user: req.session.user, error: "All the fields are required. Please fill in the missing ones." });
    } else {
      address.complete = true;
      const sessUser = req.session.user.id;
      const query = { _id: sessUser };
      try {
        const foundUser = await UserModel.findOneAndUpdate(query, {
          address: address,
        });
        await foundUser.save();
        req.session.user.address = address;
        next();
      } catch (error) {
        console.log(error, "There was an error updating the user's infos.");
      }
    }
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdmin,
  addressComplete,
  updateAddress,
};
