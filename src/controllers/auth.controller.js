const { http } = require("winston");
const { createUser, signUser }=require( "../services/auth.service.js");
const { generateToken, verifyToken } = require("../services/token.service.js");
const createHttpError = require("http-errors");

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });
const access_token=await generateToken({
userId:newUser._id},"1d",process.env.ACCESS_TOKEN_SECRET);
const refresh_token=await generateToken({
  userId:newUser._id},"1d",process.env.REFRESH_TOKEN_SECRET);

res.cookie('refreshtoken',refresh_token,{
httpOnly:true,
path:"/auth/refereshtoken",
maxAge:30*60*60*1000,
})
console.table({access_token,refresh_token});
res.json({
  message: "register success.",
  user: {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    picture: newUser.picture,
    status: newUser.status,
    token: access_token,
  },
});
  } catch (error) {
    next(error);
  }
}



module.exports.login = async (req, res, next) => {
try {
  
const {email,password}=req.body;
const user=await signUser(email,password);  /// in auth.services
const access_token=await generateToken({
  userId:user._id},"1d",process.env.ACCESS_TOKEN_SECRET);
  const refresh_token=await generateToken({
    userId:user._id},"1d",process.env.REFRESH_TOKEN_SECRET);
  
  res.cookie('refreshtoken',refresh_token,{
  httpOnly:true,
  path:"/auth/refereshtoken",
  maxAge:30*60*60*1000,
  })
  console.table({access_token,refresh_token});
  res.json({
    message: "register success.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      status: user.status,
      token: access_token,
    },
  });
} catch (error) {
  next(error);
}

}


module.exports.logout=async(req,res,next)=>{
  try {

    res.clearCookie("refreshtoken",{path:"/auth/refereshtoken"})
    
  } catch (error) {
next(error);
  }
}

module.exports.refreshtoken=async(req,res,next)=>{
  try {
    const refresh_token=req.cookies.refreshtoken;
    if(!refresh_token) throw createHttpError.Unauthorized("You need to login!");


    // now check and verify the token

    const check=verifyToken(refresh_token,process.env.REFRESH_TOKEN_SECRET); // in token.services

    const user=findUser(check.userId); // user id in check :: findUser in user.services
    const access_token=await generateToken({
      userId:user._id},"1d",process.env.ACCESS_TOKEN_SECRET);

  } catch (error) {
    next(error);
  }
}