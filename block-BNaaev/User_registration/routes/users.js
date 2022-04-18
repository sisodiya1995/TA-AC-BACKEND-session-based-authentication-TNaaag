var express = require('express');
var router = express.Router();
var User = require('../modals/user')
/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('registrationForm');
});

router.post('/register',(req ,res ,next) =>{
console.log(req.body)
User.create(req.body ,(err ,user) => {
  console.log(err ,user)
  res.redirect('/users/register')
})

});

module.exports = router;
