const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/chat',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  

  if(req.body.password.length < 4){
    errors.push({text:'Password must be at least 4 characters'});
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      username:req.body.username,
      email: req.body.email,
      password: req.body.password,
     
    });
  } else {
    User.findOne({$or:[{username:req.body.username},{email: req.body.email}]})
      .then(user => {
        if(user){  
          req.flash('error_msg', 'Either Email or User Name already exist');
          res.redirect('/users/register');
        }

         else {
          const newUser = new User({
            name: req.body.name,
            username:req.body.username,
            email: req.body.email,
            password: req.body.password
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});



//logout user

router.get('/logout' ,(req,res)=>{
   req.logout();
   req.flash('success_msg' , 'you are logged out');
   res.redirect('/users/login');
})
module.exports = router;