const ratelimit=require("express-rate-limit")
const {RedisStore}=require("rate-limit-redis")
const client=require("../config/Redis")


const limiter=ratelimit({
    windowMs:1*60*1000,
    max:100,
    standardHeaders:true,
    legacyHeaders:false,
    message:{
         success:false,
        message:"Too many requests"
    },
    skip: (req) => req.path.startsWith("/login") || req.path.startsWith("/signup"),
    store:new RedisStore({
        sendCommand:(...args)=>client.sendCommand(args),
        prefix:'gateway:rl:global:'
    })
})

const authlimiter=ratelimit({
    windowMs:10*60*1000,
    max:10,
   standardHeaders:true,
    legacyHeaders:false,
    message:{
         success:false,
        message:"Too many requests"
    },
    store:new RedisStore({
        sendCommand:(...args)=>client.sendCommand(args),
        prefix:'gateway:rl:auth:'
    })
})


module.exports={limiter,authlimiter}