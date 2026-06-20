const express=require("express")
const {registerUser,loginUser}=require("../utils/authController")
const {User}=require("../utils/mongoosedb")
const isproduction=process.env.NODE_ENV=="production"


const router=express.Router()


router.post("/signup",async (req,res)=>{
    try{
      const {email,password}=req.body
      const olduser=await User.findOne({Email:email})
      if(!olduser){
        const {AccessToken,RefreshToken}=await registerUser(email,password)
         res.cookie("AccessToken",AccessToken,{
            maxAge:15*60*1000,
            httpOnly:true,
            secure:isproduction,
            sameSite:"strict"
         })
         res.cookie("RefreshToken",RefreshToken,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            secure:isproduction,
            sameSite:"strict"
         })
        return  res.status(200).json({success:true,message:"sign-up successful"})
      }else{
        return res.status(409).json({success:false,message:`${email} already in use`})
      }
       
    }catch(err){
        console.log(err)
    }
})

router.post("/login",async (req,res)=>{
    try{
      const {email,password}=req.body
      const user=await User.findOne({Email:email})
      if(!user){
      return res.status(409).json({success:false,message:`${email} signup first`})
      }
    const {success,AccessToken,RefreshToken}=await loginUser(email,password,user.Password)
    if(success){
          res.cookie("AccessToken",AccessToken,{
            maxAge:15*60*1000,
            httpOnly:true,
            secure:isproduction,
            sameSite:"strict"
         })
          res.cookie("RefreshToken",RefreshToken,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            secure:isproduction,
            sameSite:"strict"
         })
         
       return res.status(200).json({success:true,message:"login successful"})
    }else{
       return res.status(401).json({success:false,message:"Incorrect Password"})
    }
    }catch(err){
        console.log(err)
    }
})

router.get("/health",(req,res)=>{

  return res.status(200).json({status:"healthy",uptime:process.uptime()})
})


module.exports=router