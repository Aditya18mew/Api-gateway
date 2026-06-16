

const required=[
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "INTERNAL_SECRET",
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_PASSWORD"
]


 function envRequired(){
    required.forEach(key=>{
        if(!process.env[key]){
            throw new Error(`Missing critical env var:${key}`)
        }
    })
 }

 const optional=[
    "USER_SERVICE",
    "PRODUCT_SERVICE",
    "AUTH_SERVICE"
 ]

 function envOptional(){
    optional.forEach(key=>{
        if(!process.env[key]){
          console.warn(`Warning ${key} not set: related routes will fail`)
        }
    })
 }

module.exports={envRequired,envOptional}


