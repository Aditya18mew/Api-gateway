const express=require("express")
const {bcrypting,comparepassword}=require("../utils/bcrypt")
const {User}=require("../utils/mongoosedb")



const router=express.Router()


router.post("/signup",async (req,res)=>{
    try{
      const {email,password}=req.body
      const olduser=await User.findOne({Email:email})
      if(!olduser){
        const {AccessToken,RefreshToken}=await bcrypting(email,password)
         res.cookie("AccessToken",AccessToken,{
            maxAge:15*60*1000,
            httpOnly:true,
            secure:false,
         })
         res.cookie("RefreshToken",RefreshToken,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            secure:false,
         })
          res.json({success:true,message:"sign-up successful"})
      }else{
         res.status(409).json({success:false,message:`${email} already in use`})
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
        res.status(409).json({success:false,message:`${email} signup first`})
      }
    const {success,AccessToken,RefreshToken}=await comparepassword(email,password,user.Password)
    if(success){
          res.cookie("AccessToken",AccessToken,{
            maxAge:15*60*1000,
            httpOnly:true,
            secure:false
         })
          res.cookie("RefreshToken",RefreshToken,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            secure:false,
         })
         
              res.json({success:true,message:"login successful"})
    }else{
        res.json({success:false,message:"Incorrect Password"})
    }
       
    }catch(err){
        console.log(err)
    }
})

router.get("/health",(req,res)=>{

  return res.json({status:"healthy",uptime:process.uptime()})
})


module.exports=router