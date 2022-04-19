var express = require('express');
var router = express.Router();
var User = require('../modals/user')
/* GET users listing. */

router.get('/', function(req, res, next) {
  console.log(req.session)
  res.render('success');
});

router.get('/register', function(req, res, next) {
  res.render('registrationForm');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var {email ,password} = req.body;
  if(! email ||! password) {
   return res.redirect('/users/login')
  }

  User.findOne({email} ,(err ,user) => {
    if(err) return next(err)

    // no user
    if(! user) {
      return res.redirect('/users/login');
    }

    // compare
    user.verifyPassword(password ,(err ,result) => {
      if(err) return next(err);
      console.log(err ,result)
      if(! result) {
         return res.redirect('/users/login')
      }

// persist login user info
      req.session.userID = user.id
      res.redirect('/users')

    })
  })

});


router.post('/register',(req ,res ,next) =>{
console.log(req.body)
User.create(req.body ,(err ,user) => {
  console.log(err ,user)
  res.redirect('/users/register')
})

});

module.exports = router;
