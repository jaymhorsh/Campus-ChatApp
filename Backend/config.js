const dotenv = require('dotenv')
dotenv.config();  //it will  enable us to read the content of .env file

module.exports={
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET
}

