var mongoose = require('mongoose');
var schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

var articleSchema = new schema({
    title : String ,
    description : String ,
    likes : {type : Number ,default :0} ,
    commentID :[{type : schema.Types.ObjectId, ref :"Comment"}] ,
    author : String ,
    slug: { type: String, slug: "title" }
},{timestamps : true})

var Article = mongoose.model('Article' ,articleSchema)
module.exports = Article;