const mongoose=require("mongoose")

const ProductSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    createdBy:{
       type:String
    }
})

const Product=mongoose.model("product",ProductSchema)

async function connectdb(){
  try{
   await mongoose.connect("mongodb://localhost:27017/Authservice")
  }catch(err){
     console.log(err)
     process.exit(1)
  }
}

module.exports={Product,connectdb}