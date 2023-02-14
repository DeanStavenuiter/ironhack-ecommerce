const express = require("express");
const {
  isLoggedIn,
  addressComplete,
  updateAddress,
} = require("../middleware/route-guard");
const router = express.Router();
const UserModel = require("../models/User.model");

// get route home page
router.get("/", (req, res) => {
  res.render("index", { user: req.session.user });
});

// get route profile page
router.get("/profile/:user", isLoggedIn, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// post route profile page - update user address
router.post(
  "/profile/update-address/:user",
  isLoggedIn,
  updateAddress,
  (req, res) => {
    res.redirect(
      `/profile/${req.session.user.firstName.split(" ").join("")}-${req.session.user.lastName.split(" ").join("")}`
    );
  }
);

router.post("/checkout/register", isLoggedIn, updateAddress, (req, res) => {
  res.redirect(`/checkout`);
});

// post route profile page - update user address
router.post("/profile/update-infos/:user", isLoggedIn, async (req, res) => {
  const personalInfos = { ...req.body };
  for (let property in personalInfos) {
    if (typeof property === "undefined") {
      res.render("profile", { user: req.session.user, error: "All the fields are required. Please fill in the missing ones." });
    } else {
      const sessUser = req.session.user.id;
      const query = { _id: sessUser };
      try {
        const foundUser = await UserModel.findOneAndUpdate(query, {
          firstName: personalInfos.firstName,
          lastName: personalInfos.lastName,
          email: personalInfos.email,
        });
        await foundUser.save();
        req.session.user.firstName = personalInfos.firstName;
        req.session.user.lastName = personalInfos.lastName;
        req.session.user.email = personalInfos.email;
        res.redirect(
          `/profile/${personalInfos.firstName.split(" ").join("")}-${personalInfos.lastName.split(" ").join("")}`
        );
      } catch (error) {
        console.log(error, "There was an error updating the user's infos.");
      }
    }
  }
});

module.exports = router;
