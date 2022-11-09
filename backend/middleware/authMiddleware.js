const jwt = require('jsonwebtoken');
const User = require('../models/user')


const protectedRoute = async(req, res, next) => {
    let token ;

    if(request.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{

            token = request.headers.authorization .split(" ")[1]

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //get user
            req.user = User.findById(decodedId).select('-password')
            next()
        }catch(error){

            res.status(401).json({message: 'token is incorrect', error: error.message})
        }
    }

    if(!token){
        res.status(401).json({message: 'Not Authorized  no token'})
    }

}

module.exports = {protectedRoute}