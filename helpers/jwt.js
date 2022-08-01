const { expressjwt: jwt } = require("express-jwt");

//changes were made to v6 it now returns a promise 
const isRevoked = async(req, token) => {
    if(!token.payload.isAdmin){
       return true
    }
   
}
const  authJwt = () => {
    const secret = process.env.JWT_SECRET;
    return jwt({
        secret,
        algorithms:['HS256'], 
        isRevoked:isRevoked
    }).unless({
        path:[
             //enables me to view products without being authenticated
             {url:/\/public\/uploads(.*)/, methods:['GET', 'OPTIONS']},
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
              //enables me to view categories  without being authenticated
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },// (https://regex101.com/)
            "/api/v1/users/login",
            "/api/v1/users/register",
          
        ]
    })
}

module.exports = authJwt;