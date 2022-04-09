const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const { schema } = require("./secure/userVlidation");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
      },
      family: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      studies: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.statics.userValidation = function (body) {
    return schema.validate(body, { abortEarly: false });
};

userSchema.pre("save",function(next){
  let user = this;
  if(!user.isModified("password")) return next();
  bcrypt.hash(user.password,10,(err,hash)=>{
      if(err) return next(err);
      user.password=hash;
      next();
  });  
});

module.exports = mongoose.model("User", userSchema);
