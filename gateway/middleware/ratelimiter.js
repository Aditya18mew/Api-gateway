const ratelimit=require("express-rate-limit")


const limiter=ratelimit({
    windowMs:1*60*1000,
    max:5,
    message:{
         success:false,
        message:"Too many requests"
    }
})

module.exports=limiter