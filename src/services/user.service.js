const createHttpError = require("http-errors");
const UserModel = require("../models/userModel.js");

module.exports.findUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.BadRequest("Please fil all fields!");
  return user;
};

module.exports.searchedUsers = async (keyword, userId) => {
  const users = await UserModel.find({
    $or: [
      { name: { $regex: `${keyword}`, $options: "i" } },
      { email: { $regex: `${keyword}`, $options: "i" } },
    ],
  }).find({
    _id: { $ne: userId },
  });
  return users;
};
