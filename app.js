var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose= require("mongoose")
var passport = require("passport")
var expressSanitizer = require("express-sanitizer")
var methodOverride = require("method-override")
var flash = require("connect-flash")
var LocalStrategy = require("passport-local")
var Campground =require("./models/campground")
var Comment = require("./models/comment")
var User = require("./models/user")
// var seedDB = require("./seeds")
// routes variables
var campgroundRoutes = require("./routes/campgrounds"),
    commentsRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")


// seedDB()
mongoose.connect("mongodb://localhost/yelp_camp_v3",{useNewUrlParser: true})
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())
app.use(require("express-session")({
  secret: "this is a secret session",
  resave: false,
  saveUninitialized:false
}))
app.use(expressSanitizer())
app.use(passport.initialize())
app.use(passport.session())
app.use(function(req,res,next){
  res.locals.currentUser = req.user
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next()
})
app.use(campgroundRoutes)
app.use("/campgrounds/:id/comments",commentsRoutes)
app.use(indexRoutes)

passport.use(new LocalStrategy(User.authenticate()))
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.listen(5000,process.env.IP,function(){
  console.log("YelpCamp Server has Started!!!")
})
