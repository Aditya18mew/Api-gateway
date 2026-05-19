const express=require("express")
const services=require("../config/services")
const {createProxyMiddleware}=require("http-proxy-middleware")
 const {verifyuser,refreshTokens}=require("../middleware/Authmiddleware") 


const router=express.Router()


router.use("/users",refreshTokens,verifyuser,createProxyMiddleware({
    target:services.USER_SERVICE,
    changeOrigin:true

}))

router.use("/products",refreshTokens,verifyuser,createProxyMiddleware({
     target:services.PRODUCT_SERVICE,
    changeOrigin:true
}))

router.use("/login",createProxyMiddleware({
    target:`${services.AUTH_SERVICE}/login`,
    changeOrigin:true
}))

router.use("/signup",createProxyMiddleware({
    target:`${services.AUTH_SERVICE}/signup`,
    changeOrigin:true
}))

module.exports=router
