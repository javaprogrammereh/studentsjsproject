const Post = require("../models/Post");

//* select all post
exports.selectPosts = async (req, res, next) => {
  try {
    const numberOfPosts = await Post.find({
      status: "public",
    }).countDocuments();
    const posts = await Post.find({
      status: "public",
    }).sort({
      createdAt: "desc",
    });
    if (!posts) {
      const error = new Error("هیچ پستی در پایگاه داده ثبت نشده است");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ posts, total: numberOfPosts });
  } catch (err) {
    next(err);
  }
};

//*  select single post
exports.selectSiglePosts = async (req, res, next) => {
    try {
        const post = await Post.findOne({_id:req.params.id});
        if(!post){
            const error = new Error("پستی با این شناسه یافت نشد");
            error.statusCode = 404;
            throw error;  
        }
        res.status(200).json({post});
    } catch (err) {
        next(err);
    }
};
