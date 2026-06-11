const mongoose=require("mongoose")
require("dotenv").config()


const UserSchema=mongoose.Schema({
    Email: {type:String,required:true},
    Password:{type:String,required:true},
    name:{type:String,default:""},
    phone:{type:String,default:""},
    role:{type:String,enum:["user","admin"],default:"user"},
    createdAt:{type:Date,default:Date.now()},
})

const User=mongoose.model("user",UserSchema)


async function connectdb(){
    try{
   await mongoose.connect(process.env.MONGO_DB_URL)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports={User,connectdb}