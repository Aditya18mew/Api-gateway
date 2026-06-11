require("dotenv").config()
const required=[
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

module.exports=envRequired