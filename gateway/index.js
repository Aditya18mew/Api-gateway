
const express=require("express")


const {createProxyMiddleware} = require("http-proxy-middleware")

const app=express();


app.use("/users",createProxyMiddleware({
    target:"http://localhost:3001",
    changeOrigin:true

}))

app.use("/products",createProxyMiddleware({
     target:"http://localhost:3002",
    changeOrigin:true
}))

app.use("/my",createProxyMiddleware({
    target:"https://www.youtube.com/",
    changeOrigin:true
}))

app.listen(3000,()=>{
    console.log("3000 is working")
})