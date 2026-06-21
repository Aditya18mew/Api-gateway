const express=require("express")
const {registerUser,loginUser}=require("../utils/authController")
const {User}=require("../utils/mongoosedb")
const isproduction=process.env.NODE_ENV=="production"


const router=express.Router()


router.post("/signup",async (req,res)=>{
    try{
      const {email,password}=req.body
      if( !email || !password) return res.status(400).json({success:false,message:"email and password required"})
      const olduser=await User.findOne({Email:email})
      if(!olduser){
        const {success,AccessToken,RefreshToken}=await registerUser(email,password)
        if(!success) return res.status(500).json({success:false,message:"Signup failed, please try again"})
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
        return  res.status(201).json({success:true,message:"sign-up successful"})
      }else{
        return res.status(409).json({success:false,message:`${email} already in use`})
      }
       
    }catch(err){
         console.error("Signup error:", err.message)
    return res.status(500).json({ success: false, message: "Signup failed, please try again" })
    }
})

router.post("/login",async (req,res)=>{
    try{
      const {email,password}=req.body
       if( !email || !password) return res.status(400).json({success:false,message:"email and password required"})
      const user=await User.findOne({Email:email})
      if(!user){
      return res.status(401).json({ success: false, message: "Invalid email"})
      }
    const {success,reason,AccessToken,RefreshToken}=await loginUser(email,password,user.Password)
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
      if(reason=="invalid_credentials") return res.status(401).json({success:false,message:"Incorrect Password"})
        return res.status(500).json({ success: false, message: "login failed, please try again" })
    }
    }catch(err){
         console.error("Signup error:", err.message)
    return res.status(500).json({ success: false, message: "login failed, please try again" })
    }
})

router.get("/health",(req,res)=>{

  return res.status(200).json({status:"healthy",uptime:process.uptime()})
})


module.exports=router