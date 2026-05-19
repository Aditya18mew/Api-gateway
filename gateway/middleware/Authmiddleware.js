const jwt=require("jsonwebtoken")
require("dotenv").config()

const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET

const verifyuser=async (req,res,next)=>{
      const AccessToken=req.cookies.AccessToken
    if(!AccessToken){
        return res.status(401).json({success:false,message:"UnAuthorized:No token provided"})
    }
   try{
    const decoded=jwt.verify(AccessToken,ACCESS_TOKEN_SECRET)
    req.user=decoded
    next()
   }catch(error){
      if(error.name==="TokenExpiredError"){
        return res.status(401).json({success:false,message:"Token Expired"})
      }
      return res.status(403).json({success:false,message:"Invalid Token"})
   } 
}

const refreshTokens=async (req,res,next)=>{
    const AccessToken=req.cookies.AccessToken
    if(AccessToken){
      return next()
    }
    const RefreshToken=req.cookies.RefreshToken
    if(!RefreshToken){
        return res.status(401).json({success:false,message:"UnAuthorized:No token provided"})
    }
    try{
    const decoded=jwt.verify(RefreshToken,REFRESH_TOKEN_SECRET)
    const newAccessToken=jwt.sign({
        id:decoded._id,
        Email:decoded.Email
    },ACCESS_TOKEN_SECRET,{expiresIn:"15m"})

    const newRefreshToken=jwt.sign({
        id:decoded._id,
        Email:decoded.Email
    },REFRESH_TOKEN_SECRET,{expiresIn:"7d"})
     
     res.cookie("AccessToken",newAccessToken,{
            maxAge:15*60*1000,
            httpOnly:true,
            secure:false,
         })
    res.cookie("RefreshToken",newRefreshToken,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            secure:false,
         })
            next()
   }catch(err){
       if(err.name==="TokenExpiredError"){
         return res.status(401).json({success:false,message:"Token expired"})
    }
         return res.status(403).json({success:false,message:"Invalid Token"})
   }
}


module.exports={verifyuser,refreshTokens}