const createHttpError = require("http-errors");
const jwt =require("jsonwebtoken");

async function authMiddleware (req,res,next){
  
    if(!req.headers["authorization"]) return next(createHttpError.Unauthorized("You must be logged in!"));

    const bearerToken=req.headers["authorization"];
  
    const token=bearerToken.split(" ")[1]; // removing bearer word and accessing token which 2nd part of string
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,payload)=>{
        if(error){
            console.log("Error in token");
          next(createHttpError.Unauthorized())
        }else{
            req.user=payload;
            next();
        }
    })
}

module.exports=authMiddleware;