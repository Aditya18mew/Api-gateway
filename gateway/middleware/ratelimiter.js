const ratelimit=require("express-rate-limit")


const limiter=ratelimit({
    windowMs:1*60*1000,
    max:100,
    message:{
         success:false,
        message:"Too many requests"
    }
})

const authlimiter=ratelimit({
    windowMs:15*60*1000,
    max:10,
    message:{
        success:false,
        message:"Too many requests"
    }
})


module.exports={limiter,authlimiter}