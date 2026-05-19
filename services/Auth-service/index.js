

const express=require("express")
const cookieParser=require("cookie-parser")
const routes=require("./routes/routes")
const {connectdb} = require("./utils/mongoosedb")



const app=express()

connectdb()
app.use(cookieParser())
app.use(express.json())
app.use(routes)




app.listen(3003,()=>{
    console.log("auth checking")
})