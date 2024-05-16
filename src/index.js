const app=require('./app');


const port=8080;

app.listen(port,(req,res)=>{
    console.log(`Listening to port ${port}...`);
})