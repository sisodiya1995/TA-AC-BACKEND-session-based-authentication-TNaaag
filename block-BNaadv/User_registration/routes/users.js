var express = require('express');
var router = express.Router();
var User = require('../modals/user')
/* GET users listing. */

router.get('/', function(req, res, next) {
  console.log(req.session)
  res.render('success');
});

router.get('/failed', function(req, res, next) {
  console.log(req.session)
  res.render('failed');
});

router.get('/register', function(req, res, next) {
  var wrongPassword = req.flash('wrongPassword')[0]
  res.render('registrationForm' ,{ wrongPassword});
});

router.get('/login', function(req, res, next) {
   var error = req.flash('error')[0]
   var errorPassword = req.flash('errorPassword')[0]
  
   console.log(error ,errorPassword)
  res.render('login' ,{error ,errorPassword});
});

router.post('/login', function(req, res, next) {
  var {email ,password} = req.body;
  if(! email ||! password) {
     req.flash('error' ,'email/password are required')
   return res.redirect('/users/login')
  }

if(password.length < 4){
  req.flash('errorPassword' ,'password less than four')
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
        req.flash('wrongPassword' ,'login failed')
         return res.redirect('/users/failed')
      }

// persist login user info
      req.session.userID = user.id
      res.redirect('/users')

    })
  })

});


router.post('/register',(req ,res ,next) =>{
console.log(req.body)
if(req.body.password.length < 4){
  req.flash('wrongPassword' ,'password less than four')
 return  res.redirect('/users/login')
}
User.create(req.body ,(err ,user) => {
  console.log(err ,user)
  res.redirect('/users/register')
})

});


//logout

router.get('/logout' , (req ,res) => {
  req.session.destroy();
  res.clearCookie('Connect.sid');
  res.redirect('/users/login');

})

module.exports = router;
