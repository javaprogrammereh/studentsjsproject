const { Router } = require("express");

const userController = require("../controllers/userController");

const router = new Router();

//  @desc   Register Handle
//  @route  POST /users/register
router.post("/register", userController.createUser);

//  @desc   Register Handle
//  @route  POST /users/login
router.post("/login", userController.handleLogin);

module.exports = router;
