const express=require("express")
const services=require("../config/services")
const {createProxyMiddleware}=require("http-proxy-middleware")
 const {verifyuser,refreshTokens}=require("../middleware/Authmiddleware") 
 const authGuard=[refreshTokens,verifyuser]
 const {authlimiter}=require("../middleware/ratelimiter")


const router=express.Router()


router.use("/users",...authGuard,createProxyMiddleware({
    target:services.USER_SERVICE,
    changeOrigin:true,
    proxyTimeout:5000,
    timeout:5000,
    on:{
        error:(err,req,res)=>{
         return   res.status(502).json({error:"Service temporarily unavailable"})
        }
    }

}))

router.use("/products",...authGuard,createProxyMiddleware({
     target:services.PRODUCT_SERVICE,
    changeOrigin:true,
    proxyTimeout:5000,
    timeout:5000,
    on:{
        error:(err,req,res)=>{
         return   res.status(502).json({error:"Service temporarily unavailable"})
        }
    }
}))

router.use("/login",authlimiter,createProxyMiddleware({
    target:`${services.AUTH_SERVICE}/login`,
    changeOrigin:true,
    proxyTimeout:5000,
    timeout:5000,
    on:{
        error:(err,req,res)=>{
         return   res.status(502).json({error:"Service temporarily unavailable"})
        }
    }
}))

router.use("/signup",authlimiter,createProxyMiddleware({
    target:`${services.AUTH_SERVICE}/signup`,
    changeOrigin:true,
    proxyTimeout:5000,
    timeout:5000,
    on:{
        error:(err,req,res)=>{
         return   res.status(502).json({error:"Service temporarily unavailable"})
        }
    }
}))

router.use("/health",async(req,res)=>{
    const checkservice= async (url)=>{
        try{
          const res=await fetch(`${url}/health`,{signal:AbortSignal.timeout(3000)})
          const data=await res.json()
          return {status:data.status,healthy:true}
        }catch{
          return {status:"unreachable",healthy:false}
        }
    }

    const [auth,user,product]= await Promise.all([
        checkservice(services.AUTH_SERVICE),
        checkservice(services.USER_SERVICE),
        checkservice(services.PRODUCT_SERVICE)
    ])
    
    const allhealthy=auth.healthy && user.healthy && product.healthy
   return res.status(allhealthy ? 200 :503).json({auth,user,product})
})

module.exports=router
