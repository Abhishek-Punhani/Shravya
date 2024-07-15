const createHttpError = require("http-errors");
const UserModel = require("../models/userModel.js");
module.exports.doesUserExist = async (googleId) => {
  const user = await UserModel.find({ googleId: googleId });
  if (!user) return false;
  return user;
};
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
  })
    .find({
      _id: { $ne: userId },
    })
    .select("-password");
  return users;
};

module.exports.updateUser = async (id, user) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    {
      name: user.name,
      email: user.email,
      picture: user.picture,
      status: user.status,
    },
    {
      new: true,
      select: "name email picture status",
    }
  );
  return updatedUser;
};
