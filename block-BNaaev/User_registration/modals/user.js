const { text } = require('express');
var mongoose = require('mongoose')
var schema = mongoose.Schema;
var bcrypt = require('bcrypt')


var userSchema = new schema({
   name :{type :String ,require : true} ,
   email :{type : String , require : true ,unique : true} ,
   password : {type : String ,require : true} ,
   age : Number ,
   phone : Number

} ,{timestamps : true})

userSchema.pre('save' ,function(next) {
    console.log(this ,'inside pre save')
    if(this.password && this.isModified('password')){
      bcrypt.hash(this.password ,10 ,(err ,hash) =>{
          console.log(hash)
          if(err) return next(err)
          this.password = hash ;
          return next()
      })

    } else {
       next()
    }
})

var User = mongoose.model('User' ,userSchema)
module.exports = User;