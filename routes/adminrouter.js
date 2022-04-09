const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");

const adminController = require("../controllers/adminController");

const router = new Router();

//  @desc   admin Handle Post Creation
//  @route  POST /admin/add-post
router.post("/add-post", authenticated, adminController.createPost);

//  @desc   admin Handle Post Edit
//  @route  PUT  /admin/edit-post/:id
router.put("/edit-post/:id",authenticated,adminController.editPost);

//  @desc   admin Delete Post
//  @route  GET /admin/delete-post/:id
router.delete("/delete-post/:id",authenticated,adminController.deletePost);


module.exports = router;
