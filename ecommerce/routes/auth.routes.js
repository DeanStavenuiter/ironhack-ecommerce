const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { isLoggedOut, isLoggedIn } = require("../middleware/route-guard");

//signup get route
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup", {user: req.session.user});
});

//post route to sent the signup information
router.post("/signup", isLoggedOut, async (req, res) => {
  const body = { ...req.body };

  // if (body.password.length < 6) {
  //   res.render('auth/signup', { errorMessage: 'Password too short', body: req.body })
  // } else {
  const salt = bcrypt.genSaltSync(13);
  const passwordHash = bcrypt.hashSync(body.password, salt);

  delete body.password;
  body.passwordHash = passwordHash;
  console.log(body);
  try {
    const user = await UserModel.create(body);

    const tempUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      cart: user.cart,
      images: user.images,
    };

    req.session.user = tempUser;
    res.redirect("/profile", {user: tempUser});
  } catch (error) {
    if (error.code === 11000) {
      res.render("auth/signup", {
        errorMessage: "Username already used !",
        userData: req.body,
      }, {user: req.session.user});
    } else {
      res.render("auth/signup", {
        errorMessage: error,
        userData: req.body,
      }, {user: req.session.user});
    }
  }
  // }
});

//login get route
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login", {user: req.session.user});
});

//post route to sent the login information
router.post("/login", isLoggedOut, async (req, res) => {
  const body = req.body;
console.log()
  const userMatch = await UserModel.find({ email: body.email });
  // console.log(userMatch)
  if (userMatch.length) {
    // User found
    const user = userMatch[0];

    if (bcrypt.compareSync(body.password, user.passwordHash)) {
      // Correct password

      const tempUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: user.cart,
      };
      console.log(tempUser)

      req.session.user = tempUser;
      res.redirect("/profile", {tempUser}, {user: req.session.user});
    } else {
      res.render("auth/login", {error: "Password not found"}, {user: req.session.user})
    }
  } else {
    res.render("auth/login", {error: "Username not found"}, {user: req.session.user})
  }
});

//post route to logout
router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
