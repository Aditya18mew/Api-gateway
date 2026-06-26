require("dotenv").config()
const envRequired = require("./config/config")
envRequired()



const express=require("express")
const cookieParser=require("cookie-parser")
const routes=require("./routes/routes")
const {connectdb} = require("./utils/mongoosedb")
const cors=require("cors")


const app=express()

connectdb()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin :(origin,callback)=>{
        if(!origin){
            callback(null,true)
        }else{
            callback(new Error("NOT ALLOWED BY CORS"))
        }
    },
    credentials:true
}))
app.use(routes)




app.listen( process.env.PORT || 3003,()=>{
    console.log("auth checking")
})