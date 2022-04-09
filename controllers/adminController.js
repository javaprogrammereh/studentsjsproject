const fs = require("fs");

const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Post = require("../models/Post");

//*insert post
exports.createPost = async (req, res, next) => {
  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/${fileName}`;
  try {
    req.body = { ...req.body, thumbnail };
    await Post.postValidation(req.body);
    await sharp(thumbnail.data)
      .jpeg({ quality: 60 })
      .toFile(uploadPath)
      .catch((err) => console.log(err));
    await Post.create({
      ...req.body,
      user: req.userId,
      thumbnail: fileName,
    });
    res.status(201).json({ message: "پست جدید با موفقیت ساخته شد" });
  } catch (err) {
    next(err);
  }
};
//*edit post
exports.editPost = async (req, res, next) => {
  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/${fileName}`;
  const post = await Post.findOne({ _id: req.params.id });
  try {
    if (thumbnail.name) await Post.postValidation({ ...req.body, thumbnail });
    else
      await Post.postValidation({
        ...req.body,
        thumbnail: {
          name: "placeholder",
          size: 0,
          mimetype: "image/jpeg",
        },
      });
    if (!post) {
      const error = new Error("پستی با این شناسه یافت نشد");
      error.statusCode = 404;
      throw error;
    }
    if (post.user.toString() != req.userId) {
      const error = new Error("شما مجوز ویرایش این پست را ندارید");
      error.statusCode = 401;
      throw error;
    } else {
      if (thumbnail.name) {
        fs.unlink(
          `${appRoot}/public/uploads/${post.thumbnail}`,
          async (err) => {
            if (err) console.log(err);
            else {
              await sharp(thumbnail.data)
                .jpeg({ quality: 60 })
                .toFile(uploadPath)
                .catch((err) => console.log(err));
            }
          }
        );
      }
      const { title, status, body } = req.body;
      post.title = title;
      post.status = status;
      post.body = body;
      post.thumbnail = thumbnail.name ? fileName : post.thumbnail;
      await post.save();
      res.status(200).json({ message: "پست شما با موفقیت ویرایش شد" });
    }
  } catch (err) {
    next(err);
  }
};
//*delete post
exports.deletePost = async(req, res, next) => {
  try {
    const post = await Post.findByIdAndRemove(req.params.id);
    const filePath = `${appRoot}/public/uploads/${post.thumbnail}`;
    fs.unlink(filePath,(err)=>{
      if (err) {
        const error = new Error("خطای در پاکسازی عکس پست مربوطه رخ داده است");
        error.statusCode  = 400;
        throw error;
      } else {
        res.status(200).json({message:"پست شما با موفقیت پاک شد"});
      }
    });
  } catch (err) {
    next(err);
  }
};
