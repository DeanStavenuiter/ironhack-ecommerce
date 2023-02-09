const express = require('express');
const router = express.Router();

// get route admin panel
router.get("/", (req, res) => {
  res.render("/admin/panel");
});

// get route create new product
router.get("/create", (req, res) => {
    res.render("/admin/create");
  });

// post route to create new product
router.post("/create", (req, res) => {
    res.redirect("/")
})

// get route all users page
// router.get("/user-list", (req, res) => {
//     res.render("/admin/user-list");
//   });


module.exports = router;