const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv/config')
const connectDb = require('./config/db')
const productRoute = require('./routes/product')
const categoryRoute=require('./routes/category')

app.use(cors())
// app.options('*', cors( ))







//middleware
app.use(
    express.urlencoded({ extended: true })
);

app.use(express.json());
//app.use(bodyParser.json()) //for getting data from our req.body
app.use(morgan('tiny')) //used to log request from the frontend
//app.use(authJwt()) //for route protection
// app.use(errorHandling)// for handling errors


//import my model
const Product = require('./models/product');
const Category = require('./models/category')

//import myRouter
const productRouter = require('./routes/product')
const categoryRouter = require('./routes/category')
//const userRouter = require('./routers/user')
//const orderRouter = require('./routers/order')


const api = process.env.API_URL
//routers
app.use(`${api}/products`, productRouter)
app.use(`${api}/categories`, categoryRouter)
//app.use(`${api}/users`, userRouter)
//app.use(`${api}/orders`, orderRouter)

connectDb()
const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})