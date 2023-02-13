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
      `/profile/${req.session.user.firstName}-${req.session.user.lastName}`
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
      res.render("profile", { user: req.session.user, error: "FKOFFF" });
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
          `/profile/${personalInfos.firstName}-${personalInfos.lastName}`
        );
      } catch (error) {
        console.log(error, "There was an error updating the user's infos.");
      }
    }
  }
});

// get route checkout page
router.get("/checkout", isLoggedIn, addressComplete, async (req, res) => {
  const user = await UserModel.findOne({
    email: req.session.user.email,
  }).populate("cart.product");
  res.render("checkout", { user });
});

router.get("/checkout/register", isLoggedIn, async (req, res) => {
  const user = await UserModel.findOne({
    email: req.session.user.email,
  }).populate("cart.product");
  res.render("checkout-register", { user });
});

// post route check page
// router.post("/checkout", isLoggedIn, (req, res) => {
//   res.redirect("/success", { user: req.session.user });
// });

module.exports = router;
