const {Router} = require('express');

const postsController = require('../controllers/postsController');

const router = new Router();

//  @desc   select posts Page
//  @route  GET /posts/select-all
router.get("/select-all",postsController.selectPosts);

//  @desc   select single post Page
//  @route  GET /posts/select-single/:id
router.get("/select-single/:id",postsController.selectSiglePosts);


module.exports = router;