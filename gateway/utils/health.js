 const services=require("../config/services")
 
 const healthcheck=async()=>{
    const checkservice= async (url,target)=>{
        try{
          const res=await fetch(`${url}/health`,{signal:AbortSignal.timeout(3000)})
          const data=await res.json()
          return {service:target,status:data.status,healthy:true,uptime:data.uptime}
        }catch{
          return {service:target,status:"unreachable",healthy:false}
        }
    }

    const [auth,user,product]= await Promise.all([
        checkservice(services.AUTH_SERVICE,"auth-service"),
        checkservice(services.USER_SERVICE,"user-service"),
        checkservice(services.PRODUCT_SERVICE,"product-service")
    ])
    
    return [auth,user,product]
  /*   const allhealthy=auth.healthy && user.healthy && product.healthy
   return res.status(allhealthy ? 200 :503).json({gateway:{status:"healthy",healthy:true,uptime:process.uptime()},services:{auth,user,product}}) */
}

const previousStates={
    "auth-service":true,
    "user-service":true,
    "product-service":true
}

const runhealthcheck=async ()=>{
   const current=await healthcheck()
    current.forEach((key)=>{
      if(previousStates[key.service]!=key.healthy){
         previousStates[key.service]=key.healthy;
         console.log(`[Health] ${key.service} is now 
           ${key.healthy ? "Healthy":"Unhealthy"}`)
      }
    })
}

runhealthcheck()


module.exports={healthcheck,runhealthcheck}