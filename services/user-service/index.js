const express=require("express")


const app=express()


app.get("/",(req,res)=>{

    res.json({
        services:"user services",
        users:["Aditi","sam","hero"]
    })
})

app.get("/health",(req,res)=>{

  return res.json({status:"healthy"})
})

app.listen(3001,()=>{
    console.log("server is listenting")
})