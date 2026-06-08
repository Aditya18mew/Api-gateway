const express=require("express")
const {User,connectdb}=require("./utils/mongoosedb")
require("dotenv").config()

const INTERNAL_SECRET=process.env.INTERNAL_SECRET


const app=express()
app.use(express.json())  /* if anything goes bad this line might be the cause */
connectdb()


app.get("/admin/users",async (req,res)=>{

    if(req.headers["x-internal-secret"]!==INTERNAL_SECRET){
        return res.status(403).json({error:"Direct access not allowed"})
    }

    if(req.headers["x-role"]!=="admin"){
        return res.status(403).json({error:"Admins only"})
    }

    try{
      const users = await User.find().select("-Password")
       if(!users) res.status(404).json({error:"No users found"})
        return res.status(200).json({users:users})
    }catch{
        return  res.status(500).json({error:"failed to fetch users"})
    }

})

app.get("/profile",async (req,res)=>{

    if(req.headers["x-internal-secret"]!==INTERNAL_SECRET){
        return res.status(403).json({error:"Direct access not allowed"})
    }

    const userid=req.headers["x-user-id"]

    try{
         const user=await User.findById(userid).select("-Password")
        if(!user) res.status(404).json({error:"user not found"})
        return res.status(200).json({user:user})
    }catch(err){
       return res.status(500).json({error:"failed to fetch profile"})
    }
})

app.put("/profile",async (req,res)=>{

    if(req.headers["x-Internal-secret"]!==INTERNAL_SECRET){
        return res.status(403).json({error:"Direct access not allowed"})
    }

    const userid=req.headers["x-user-id"]
    const {name,phone}=req.body
    
    try{
     const user= await User.findByIdAndUpdate(userid,{name,phone}, { returnDocument: 'after' }).select("-Password")
     if(!user) res.status(404).json({error:"user not found"})
      return  res.status(200).json({user:user})
    }catch{
       return res.status(500).json({error:"failed to update profile"})
    }
})

app.get("/health",(req,res)=>{
     return res.json({status:"healthy",uptime:process.uptime()})
})

app.listen(3001,()=>{
    console.log("server is listenting")
})