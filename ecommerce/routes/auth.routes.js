const express = require("express");
const router = express.Router();
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs')

//signup get route
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//post route to sent the signup information
router.post('/signup', async (req, res) => {
    const body = { ...req.body }
  
    // if (body.password.length < 6) {
    //   res.render('auth/signup', { errorMessage: 'Password too short', body: req.body })
    // } else {
      const salt = bcrypt.genSaltSync(13)
      const passwordHash = bcrypt.hashSync(body.password, salt)
  
      delete body.password
      body.passwordHash = passwordHash
    console.log(body)
      try {
        await UserModel.create(body)
        res.send(body)
      } catch (error) {
        if (error.code === 11000) {
          res.render('auth/signup', {
            errorMessage: 'Username already used !',
            userData: req.body,
          })
        } else {
          res.render('auth/signup', {
            errorMessage: error,
            userData: req.body,
          })
        }
      }
    // }
  })

//login get route
router.get("/login", (req, res, ) => {
  res.render("auth/login");
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

