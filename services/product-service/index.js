const express=require("express")
const {Product,connectdb}=require("./utils/mongoosedb")


const app=express()
app.use(express.json())

connectdb()

app.get("/",async (req,res)=>{
    try{
   const products=await Product.find().select("title price")
         res.json({
        service:"products",
        products:products
    })
    }catch{
       res.status(500).json({Error:"failed to fetch products"})
    }
})

app.post("/add", async (req, res) => {
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
    res.status(201).json({ message: "Product added", product: newProduct })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Failed to add product" })
  }
})
 
app.put("/:id", async (req, res) => {
  try {
    const { title, price } = req.body
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, price },
      { new: true, runValidators: true }
    )
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json({ message: "Product updated", product: updatedProduct })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Failed to update product" })
  }
})

app.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json({ message: "Product deleted", product: deletedProduct })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Failed to delete product" })
  }
})

app.get("/health",(req,res)=>{
   return res.json({status:"healthy",uptime:process.uptime()})
})

app.listen(3002,()=>{
    console.log("product is on")
})