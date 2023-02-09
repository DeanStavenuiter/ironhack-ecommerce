const express = require("express");
const router = express.Router();

//signup get route
router.get("/signup", (req, res) => {
  res.render("/auth/signup");
});

//post route to sent the signup information
router.post("/signup", (req, res) => {
  res.redirect("/profile");
});

//login get route
router.get("/login", (req, res, ) => {
  res.render("/auth/login");
});

//post route to sent the login information
router.post("/login", (req, res) => {
    res.redirect("/");
  });

//post route to logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });


  
module.exports = router;

