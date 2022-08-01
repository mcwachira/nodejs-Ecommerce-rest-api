const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config()

const authJwt = require('./helpers/jwt')
const errorHandling = require('./helpers/error-handling')
const app = express();

app.use(cors())
app.options('*', cors())





const api = process.env.API_URL
const mongoDatabase = process.env.CONNECTION_STRING

//import my model
const Product = require('./models/product');
const Category = require('./models/category')

//import myRouter
const productRouter = require('./routers/product')
const categoryRouter = require('./routers/categories')
const userRouter = require('./routers/user')
const orderRouter = require('./routers/order')
//middleware
app.use(bodyParser.json()) //for getting data from our req.body
app.use(morgan('tiny')) //used to log request from the frontend
app.use(authJwt()) //for route protection
// app.use(errorHandling)// for handling errors

//routers
app.use(`${api}/products`, productRouter)
app.use(`${api}/categories`, categoryRouter)
app.use(`${api}/users`, userRouter)
app.use(`${api}/orders`, orderRouter)


//database connection promise
mongoose.connect(mongoDatabase, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    name:'ecommerce-database'
})





app.listen(3000)