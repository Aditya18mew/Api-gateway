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

    return {AccessToken:AccessToken,RefreshToken:RefreshToken}
   }catch(err){
    console.log(err)
   }
}

async function loginUser(email,password,hashpassword){
  try{
 const match=await bcrypt.compare(password,hashpassword)

 if(!match) return {success:false,AccessToken:null,RefreshToken:null}

 const {AccessToken,RefreshToken}=await generatejwt(email)

 return {success:true,AccessToken:AccessToken,RefreshToken:RefreshToken}

  }catch(err){
    console.log(err)
  }
}

module.exports={registerUser,loginUser}