const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.createUser = async (req, res, next) => {
  try {
    await User.userValidation(req.body);
    const { name, family, email, studies, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const error = new Error("کاربری با این ایمیل در پایگاه داده موجود است");
      error.statusCode = 422;
      throw error;
    } else {
      await User.create({ name, family, email, studies, password });
      res.status(201).json({ message: "عضویت موفقیت آمیز بود" });
    }
  } catch (err) {
    next(err);
  }
};

exports.handleLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("کاربری با این ایمیل یافت نشد");
      error.statusCode = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (isEqual) {
      const token = jwt.sign(
        {
          user: {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
          },
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token, userId: user._id.toString() });
    } else {
      const error = new Error("آدرس ایمیل یا کلمه عبور اشتباه است");
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
