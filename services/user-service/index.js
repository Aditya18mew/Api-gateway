const express=require("express")
const {User,connectdb}=require("./utils/mongoosedb")


const app=express()
app.use(express.json())  /* if anything goes bad this line might be the cause */
connectdb()


app.get("/",(req,res)=>{

    res.json({
        services:"user services",
        users:["Aditi","sam","hero"]
    })
})

app.get("/health",(req,res)=>{

  return res.json({status:"healthy",uptime:process.uptime()})
})

app.listen(3001,()=>{
    console.log("server is listenting")
})