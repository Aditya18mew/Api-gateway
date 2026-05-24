
const express=require("express")
const cookieParser=require("cookie-parser")
const logger=require("./middleware/logger");
const routes = require("./routes/routes");
const {limiter}=require("./middleware/ratelimiter")


const app=express();


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

app.listen(3000,()=>{
    console.log("3000 is working")
})