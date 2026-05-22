const { v4: uuidv4 } = require("uuid")

const logger=(req,res,next)=>{

    const requestId=req.headers["x-request-id"] || uuidv4()
      req.id=requestId
   
  const start=Date.now()

  res.on("finish",()=>{
    const end=Date.now()
     console.log(
         `${req.method} ${req.url} ${res.statusCode} ${req.id} ${end-start}ms`
      )
  })
  next();
}


module.exports=logger