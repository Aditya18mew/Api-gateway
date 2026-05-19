const mongoose=require("mongoose")


const UserSchema=mongoose.Schema({
    Email:String,
    Password:String,
    AccessToken:String,
    createdAt:Date,
    expiredAt:Date
})

const User=mongoose.model("user",UserSchema)


async function connectdb(){
    try{
   await mongoose.connect("mongodb://localhost:27017/Authservice")
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports={User,connectdb}