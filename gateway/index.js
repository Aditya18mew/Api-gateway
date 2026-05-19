
const express=require("express")
const cookieParser=require("cookie-parser")
const logger=require("./middleware/logger");
const routes = require("./routes/routes");


const app=express();


app.use(logger)
app.use(cookieParser())
app.use(routes)



app.listen(3000,()=>{
    console.log("3000 is working")
})