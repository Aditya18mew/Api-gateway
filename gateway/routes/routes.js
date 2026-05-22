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

router.use("/health",async(req,res)=>{
    const auth=await fetch(`${services.AUTH_SERVICE}/health`)
    const user=await fetch(`${services.USER_SERVICE}/health`)
    const product=await fetch(`${services.PRODUCT_SERVICE}/health`)

    const authservicehealth= await auth.json()
    const userservicehealth=await user.json()
    const productserviehealth=await product.json()

   return res.status(200).json({Auth_health_status:authservicehealth.status,User_health_status:userservicehealth.status,Product_health_status:productserviehealth})
})

module.exports=router
