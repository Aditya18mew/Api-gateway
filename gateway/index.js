const  {envRequired,envOptional}=require("./config/config")
envRequired()
envOptional()



const express=require("express")
const cookieParser=require("cookie-parser")
const logger=require("./middleware/logger");
const routes = require("./routes/routes");
const {limiter}=require("./middleware/ratelimiter")
require("dotenv").config()
require("./config/Redis")
const cors=require("cors")


const app=express();

app.use(cors({
    origin:"*",
    credentials:false
}))
app.use(logger)
app.use(cookieParser())
app.use(limiter)
app.use(routes)

app.use((req,res)=>{
    res.status(404).json({error:`Route ${req.method} ${req.path} Not Found`})
})

app.use((err,req,res,next)=>{
    console.log(err.stack)
    res.status(500).json({error:"Internal gateway error"})
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("3000 is working")
})