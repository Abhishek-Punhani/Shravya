const express= require("express");
const path=require("path");
const morgan=require("morgan");
const helmet=require("helmet");
const mongoSanitize=require("express-mongo-sanitize");
const cookieParser=require("cookie-parser");
const compression=require("compression");
const fileUpload=require("express-fileupload");
const cors=require("cors");
require("dotenv").config();
const app=express();

if(process.env.NODE_ENV !=="production"){
app.use(morgan("dev"));
}


app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(mongoSanitize());
app.use(cookieParser());
app.use(compression());
app.use(fileUpload({useTempFiles:true}));
app.use(cors());
module.exports=app;
