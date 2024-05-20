const createHttpError = require("http-errors");
const UserModel = require("../models")

module.exports.findUser=async (userId)=>{
    const user=await UserModel.findById(userId);
    if(!user) throw createHttpError.BadRequest("Please fil all fields!");
    return user;
}