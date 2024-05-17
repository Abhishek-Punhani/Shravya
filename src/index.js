const app=require('./app');
const logger=require("./configs/logger");

const port=8080;

app.listen(port,(req,res)=>{
    logger.info(`Listening to port ${port}...`);
})