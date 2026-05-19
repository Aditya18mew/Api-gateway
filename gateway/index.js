
const express=require("express")

const logger=require("./middleware/logger");
const routes = require("./routes/routes");


const app=express();


app.use(logger)

app.use(routes)



app.listen(3000,()=>{
    console.log("3000 is working")
})