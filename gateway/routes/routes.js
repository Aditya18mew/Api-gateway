const express=require("express")
const services=require("../config/services")
const {createProxyMiddleware}=require("http-proxy-middleware")


const router=express.Router()

router.use("/users",createProxyMiddleware({
    target:services.USER_SERVICE,
    changeOrigin:true

}))

router.use("/products",createProxyMiddleware({
     target:services.PRODUCT_SERVICE,
    changeOrigin:true
}))

module.exports=router
