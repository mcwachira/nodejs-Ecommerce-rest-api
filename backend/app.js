const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan')
require('dotenv/config')
const connectDb = require('./config/db')


app.use(cors())

//middleware
app.use(   express.urlencoded({ extended: true }));

app.use(express.json());
//app.use(bodyParser.json()) //for getting data from our req.body
app.use(morgan('tiny')) //used to log request from the frontend




//import myRouter
const productRouter = require('./routes/product')
const categoryRouter = require('./routes/category')



const api = process.env.API_URL
//routers
app.use('/products', productRouter)
app.use('/categories', categoryRouter)


connectDb()
const port = 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})