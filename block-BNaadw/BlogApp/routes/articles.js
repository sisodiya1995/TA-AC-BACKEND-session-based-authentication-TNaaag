var express = require('express');
var router = express.Router();
var Article = require('../modals/article')
var Comment = require('../modals/comment');
const User = require('../modals/user');
/* GET home page. */

// create

router.get('/new', function(req, res, next) {
  res.render('articleform');
});

router.post("/", (req, res, next) => {
    // console.log(req.body)
    Article.create(req.body, (err, articles) => {
     // console.log(event);
      if (err) return next(err);
      res.redirect("/articles/new");
    });
  });

//read
router.get('/' ,(req ,res ,next) =>{
  Article.find({} ,(err ,articles) => {
      //console.log(err ,articles)
      if(err) return next(err)
      res.render('articles' ,{articles})
  })
})

router.get("/:slug", (req, res, next) => {
    var slug = req.params.slug;
    Article.findOne({slug :slug}) 
      .populate("commentID")
      .exec((err, article) => {
          console.log(article)
        if (err) return next(err);
        res.render("singleArticle", {article});
      });
  });

// Edit route
router.get("/:slug/edit", (req, res, next) => {
    var slug = req.params.slug;
    Article.findOne({slug : slug}, (err, article) => {
        //console.log(article)
      if (err) return next(err);
      res.render("articleEditForm", {article});
    });
  });

  router.post("/:slug/edit", (req, res, next) => {
    var slug = req.params.slug;
    Article.findOneAndUpdate({slug : slug}, req.body, (err, updateArticle) => {
        console.log(updateArticle)
      if (err) return next(err);
      res.redirect("/articles/" + slug);
    });
  });

// delete
  router.get("/:slug/delete", (req, res, next) => {
    var slug = req.params.slug;
    Article.findOneAndDelete({slug : slug}, (err, deleteArticle) => {
      if (err) return next(err);
      res.redirect("/articles/");
    });
  });

// Article Likes

router.get("/:slug/like", (req, res, next) => {
    var slug = req.params.slug;
  
    Article.findOneAndUpdate({slug : slug}, { $inc: { likes: 1 } }, (err, incrementLikes) => {
      console.log(incrementLikes);
      if (err) return next(err);
      res.redirect("/articles/" + slug);
    });
  });

  // Article Dislike

  router.get("/:slug/dislike", (req, res, next) => {
    var slug = req.params.slug;
    Article.findOne({slug :slug}, (err, decerementLikes) => {
      if (decerementLikes.likes > 0) {
        Article.findOneAndUpdate({slug : slug}, { $inc: { likes: -1 } }, (err, event) => {
          console.log(event);
          if (err) return next(err);
          res.redirect("/articles/" + slug);
        });
      } else {
        res.redirect("/articles/" + slug);
      }
    });
  });

  // addcomments

  router.post("/:slug/comment", (req, res, next) => {
    req.body.articleID = req.params.id;
    var slug = req.params.slug;
    req.body.articleSlug = slug;
    console.log(req.params.id ,"id")
    Comment.create(req.body, (err, comment) => {
      console.log(comment);
      if (err) return next(err);
      Article.findOneAndUpdate(
        {slug :slug},
        { $push: {commentID : comment.id } },
        (err, updatearticle) => {
          console.log(err, updatearticle);
          res.redirect("/articles/" + updatearticle.slug);
        }
      );
    });
  });
module.exports = router;