const pino=require("pino")
const { v4: uuidv4 } = require("uuid")
const log=pino()
const logger=(req,res,next)=>{

    const requestId=req.headers["x-request-id"] || uuidv4()
      req.id=requestId
      res.setHeader("x-request-id",requestId)
      req.headers["x-request-id"]=requestId
   
  const start=Date.now()

  res.on("finish",()=>{
    const end=Date.now()
    log.info({requestId,method:req.method,url:req.url, status:res.statusCode, duration:`${end-start}ms`})
  })
  next();
}


module.exports=logger