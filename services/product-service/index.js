const envRequired = require("./config/config")
envRequired()







const express=require("express")
const {Product,connectdb}=require("./utils/mongoosedb")

require("dotenv").config()

const INTERNAL_SECRET=process.env.INTERNAL_SECRET

const Internalcheck=(req,res,next)=>{
   if(req.headers["x-internal-secret"]!==INTERNAL_SECRET){
        return res.status(403).json({error:"Direct access not allowed"})
    }
    next();
}


const app=express()
app.use(express.json())

connectdb()



app.get("/products",Internalcheck,async (req,res)=>{
    try{
   const products=await Product.find().select("title price")
      return  res.status(200).json({
        service:"products",
        products:products
    })
    }catch{
       res.status(500).json({Error:"failed to fetch products"})
    }
})


app.get("/products/:id",Internalcheck,async (req,res)=>{
    try{
   const product=await Product.findById(req.params.id)
      return  res.status(200).json({
        service:"product",
        product:product
    })
    }catch{
     return  res.status(500).json({Error:"failed to fetch products"})
    }
})



app.post("/admin/products/add",Internalcheck ,async (req, res) => {
     if(req.headers["x-role"]!=="admin"){
        return res.status(403).json({error:"Admins only"})
    }
  try {
    const { title, price } = req.body
    if (!title || price === undefined) {
      return res.status(400).json({ error: "title and price are required" })
    }
    const newProduct = new Product({ 
        title:title,
        price:price
    })

    await newProduct.save()
   return res.status(201).json({ message: "Product added", product: newProduct })
  } catch (err) {
    console.error(err)
   return res.status(500).json({ error: "Failed to add product" })
  }
})
 


app.put("/admin/products/:id",Internalcheck ,async (req, res) => {
         if(req.headers["x-role"]!=="admin"){
        return res.status(403).json({error:"Admins only"})
    }
  try {
    const { title, price } = req.body
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, price },
     { returnDocument: 'after' }
    )
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" })
    }
   return res.json({ message: "Product updated", product: updatedProduct })
  } catch (err) {
    console.error(err)
   return res.status(500).json({ error: "Failed to update product" })
  }
})



app.delete("/admin/products/:id",Internalcheck, async (req, res) => {
      if(req.headers["x-role"]!=="admin"){
        return res.status(403).json({error:"Admins only"})
    }
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" })
    }
   return res.json({ message: "Product deleted", product: deletedProduct })
  } catch (err) {
    console.error(err)
   return res.status(500).json({ error: "Failed to delete product" })
  }
})



app.get("/health",(req,res)=>{
   return res.json({status:"healthy",uptime:process.uptime()})
})



app.listen(process.env.PORT || 3002,()=>{
    console.log("product is on")
})