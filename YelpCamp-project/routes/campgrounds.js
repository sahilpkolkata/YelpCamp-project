
var express = require("express")
var router = express.Router({mergeParams:true})
var Campground = require("../models/campground")
var middleware = require("../middleware")
var expressSanitizer = require("express-sanitizer")

router.get("/campgrounds",function(req,res){
  Campground.find({},function(err,allCampgrounds){
    if(err){
      console.log("error!!")
      console.log(err)
    }else{
      res.render("campgrounds/index",{campgrounds:allCampgrounds})
    }
  })

})
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
  var name= req.body.name
  var price = req.body.price
  var image= req.body.image
  var desc = req.body.description
  var author = {
    id :req.user._id,
    username : req.user.username
  }
  var newCampground = {name:name,price:price,image:image, description: desc, author:author}
  Campground.create(newCampground,function(err,newlyCreated){
    if(err){
      console.log(err)
    }else{
      res.redirect("/campgrounds")
    }
  })


})
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
  res.render("campgrounds/new")
})
router.get("/campgrounds/:id",function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err || !foundCampground){
      req.flash("error","Campground not Found!!")
      res.redirect("back")
    }else{
      res.render("campgrounds/show",{campground:foundCampground})
    }
  })
})

//edit campgrounds
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findById(req.params.id,function(err,foundCampground){
    if(err){
      res.redirect("/campgrounds")
    }else{
      res.render("campgrounds/edit",{campground:foundCampground})
    }
  })
})
//update
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
  // Campground.findById(req.params.id,function(err,foundCampground){
  //   if(err || !foundCampground){
  //     req.flash("error","Campground not found!!")
  //     res.redirect("/campgrounds")
  //   }else{
  //     Campground.updateOne(req.body.campground,function(err,updatedCampground){
  //       if(err){
  //         res.redirect("/campgrounds")
  //       }else{
  //         res.redirect( "/campgrounds/" + req.params.id)
  //       }
  //     })
  //   }
  // })
  req.body.campground.body = req.sanitize(req.body.campground.body)
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err || !updatedCampground){
         req.flash("error","Campground not found!!")
         res.redirect("/campgrounds")
       }else{
         res.redirect("/campgrounds/" + req.params.id)
   }
 })

})

//DESTROY ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/campgrounds")
    }else{
      res.redirect("/campgrounds")
    }
  })
})

module.exports = router
