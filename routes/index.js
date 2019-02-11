var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")

router.get("/",function(req,res){
  res.render("landing")
})

router.get("/register",function(req,res){
  res.render("register")
})

router.post("/register",function(req,res){
  req.body.username
  req.body.password
  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
    if(err){
      req.flash("error" , err.message)
      return res.render("register")
    }
    passport.authenticate("local")(req,res,function(){
      req.flash("success" , "Welcome to YelpCamp " + user.username)
      res.redirect("/campgrounds")
    })
  })
})

router.get("/login",function(req,res){
  res.render("login")
})

router.post("/login",passport.authenticate("local",
{
  successRedirect:"/campgrounds",
  failureRedirect:"/login"
}),function(req,res){
})
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash("error", "Invalid username or password");
      return res.redirect('/login');
    }
    req.logIn(user, err => {
      if (err) { return next(err); }
      let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/campgrounds';
      delete req.session.redirectTo;
      req.flash("success", "Good to see you again, " + user.username);
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

router.get("/logout",function(req,res){
  req.logout()
  req.flash("success", "Logged you out!!")
  res.redirect("/campgrounds")
})

module.exports = router
