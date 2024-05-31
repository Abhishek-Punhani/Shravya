const createHttpError = require("http-errors");
const { searchedUsers } = require("../services/user.service");

module.exports.searchUsers= async (req,res,next)=>{
    try {
        const keyword=req.query.search;
        if(!keyword){
            logger.error("Keyword required!");
            throw createHttpError.BadRequest("OOPS.....Something went wrong!");
        }
        const users=await searchedUsers(keyword);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}