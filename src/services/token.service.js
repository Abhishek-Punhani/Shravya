const { sign, verify } = require("../utils/token.util");

module.exports.generateToken=async (payload,expiresIn,secret)=>{
let token=await sign(payload,expiresIn,secret);
return token;
}

module.exports.verifyToken=async(token,secret)=>{
    let check =verify(token,secret);  // this verfifies token and return user id
    return check;
}