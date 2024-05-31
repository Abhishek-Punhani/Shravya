module.exports.searchUsers= async (req,res,next)=>{
    try {
        res.send("hello");
    } catch (error) {
        next(error);
    }
}