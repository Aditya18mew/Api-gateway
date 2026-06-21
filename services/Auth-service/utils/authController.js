const generatejwt = require("./generatejwt")
const {User}=require("./mongoosedb")
const bcrypt=require("bcrypt")




async function registerUser(email,password){
   try{
      const hashpassword=await bcrypt.hash(password,10)
      const newuser=new User({
        Email:email,
        Password:hashpassword
      })
        await newuser.save()
    
    const {AccessToken,RefreshToken}=await generatejwt(email)

    return {success:true,AccessToken:AccessToken,RefreshToken:RefreshToken}
   }catch(err){
    console.log("Signup error", err.message)
    return {success:false,err:err.message}
   }
}

async function loginUser(email,password,hashpassword){
  try{
 const match=await bcrypt.compare(password,hashpassword)

 if(!match) return {success:false,reason: "invalid_credentials",AccessToken:null,RefreshToken:null}

 const {AccessToken,RefreshToken}=await generatejwt(email)

 return {success:true, reason:null ,AccessToken:AccessToken, RefreshToken:RefreshToken}

  }catch(err){
    console.log("Signup error", err.message)
    return {success:false,reason:"server error",AccessToken:null,RefreshToken:null}
  }
}

module.exports={registerUser,loginUser}