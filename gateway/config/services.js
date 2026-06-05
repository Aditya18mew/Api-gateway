require("dotenv").config()


const services={
    USER_SERVICE:process.env.USER_SERVICE,
    PRODUCT_SERVICE:process.env.PRODUCT_SERVICE,
    AUTH_SERVICE:process.env.AUTH_SERVICE
}

module.exports=services