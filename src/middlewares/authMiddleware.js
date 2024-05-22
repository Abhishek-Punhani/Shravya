const createHttpError = require("http-errors");
const jwt =require("jsonwebtoken");

async function authMiddleware (req,res,next){
    if(!req.headers["authorisation"]) return next(createHttpError.Unauthorized("You must be logged in!"));

    const bearerToken=req.headers["authorisation"];
    const token=bearerToken.split(" ")[1]; // removing bearer word and accessing token which 2nd part of string
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,payload)=>{
        if(err){
          next(createHttpError.Unauthorized())
        }else{
            req.user=payload;
            next();
        }
    })
}