
const required=[
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
     "INTERNAL_SECRET",
     "MONGO_DB_URL"
]

function envRequired(){
    required.forEach(key=>{
        if(!process.env[key]){
            throw new Error(`Missing critical env var: ${key}`)
        }
    })
}

module.exports=envRequired;