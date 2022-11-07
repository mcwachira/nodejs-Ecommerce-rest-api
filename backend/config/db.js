const mongoose = require("mongoose");
const colors = require('colors')

console.log(process.env.MONGO_URI)


const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'ecommerce-database'
        })
        console.log(`MongoDb  connected ${connect.connection.host}`.blue.underline)
    }catch(error){
        console.log(`error :${error.messages}`.red.underline.bold, error)
        process.exit(1)
    }
}

module.exports = connectDb;