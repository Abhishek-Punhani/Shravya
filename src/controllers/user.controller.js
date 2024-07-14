const createHttpError = require("http-errors");
const { searchedUsers, updateUser } = require("../services/user.service");

module.exports.searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search;
    if (!keyword) {
      logger.error("Keyword required!");
      throw createHttpError.BadRequest("OOPS.....Something went wrong!");
    }
    const users = await searchedUsers(keyword, req.user.userId);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
module.exports.updateUserInfo = async (req, res, next) => {
  try {
    let { user } = req.body;
    let id = req.user.userId;
    const updatedUser = await updateUser(id, user);
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
