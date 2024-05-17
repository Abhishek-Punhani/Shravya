const { error } = require('winston');
const app=require('./app');
const logger=require("./configs/logger");
const mongoose=require("mongoose");
const port=8080;
const {DB_URL}=process.env;




// handling mongo error

mongoose.connection.on("error",(err)=>{
  logger.error(`Mongo Connection Error ${err}`);
  process.exit(1);
})


mongoose.connect(DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    logger.info("Connected to db");
})

// debug mode on :: lets u know all changes in db on ur console
if(process.env.NODE_ENV !=="production"){
mongoose.set("debug",true);
}

const server = app.listen(port,(req,res)=>{
    logger.info(`Listening to port ${port}...`);
})

const exithandler=()=>{
    if(server){
        logger.info("Server Closed");
        process.exit(1);
    }else{
        process.exit(1);
    }
}

const unexpectederrorhandler=(error)=>{
    logger.error(error);
    exithandler();
}
process.on("uncaughtException",unexpectederrorhandler);
process.on("unhandledRejection",unexpectederrorhandler);

// SIGTERM

process.on("SIGTERM",()=>{
    if(server){
        logger.info("Server Closed");
        process.exit(1);
    }
})