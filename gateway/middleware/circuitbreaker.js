const CircuitBreaker=require("opossum");


const options={
    timeout:5000,
    errorThresholdPercentage:50,
    resetTimeout:20000,
    volumeThreshold:3
}



const createCircuitBreaker=(proxyfn,target)=>{
    const breaker=new CircuitBreaker(proxyfn,options)

    breaker.on("open",()=>console.warn(`Circuit Open`))
    breaker.on("close",()=> console.log(`Circuit closed`))
    breaker.on("halfOpen",()=> console.log(`Circuit half-Open`))

    return breaker
}





module.exports=createCircuitBreaker