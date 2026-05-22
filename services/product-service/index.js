
const express=require("express")


const app=express()

app.get("/",(req,res)=>{

    res.json({
        service:"products",
        products:[
            {
                name:"Laptop",
                price:50000
            },
            {
                name:"phone",
                price:25000
            },
            {
                name:"monitor",
                price:30000
            }
        ]
    })
})

app.get("/health",(req,res)=>{

  return res.json({status:"healthy"})
})

app.listen(3002,()=>{
    console.log("product is on")
})