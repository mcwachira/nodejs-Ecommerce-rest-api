

const errorHandler = (error, req, res, next) => {
    //jwt authentication error
    if(error.name === 'UnauthorizedError'){
       return  res.status(401).json({
            messages:'THe user is not authorized',
            stack: process.env.NODE_ENV === 'production' ? null : error.stack
        })
    }
    //validation error
    if(error.name === 'ValidationError'){
       return  res.status(500).json({
            message:error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack
})
    }
    //default server error
    return res.status(500).json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack
})

}

module.exports = errorHandler