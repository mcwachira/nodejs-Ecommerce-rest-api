const { expressjwt: jwt } = require('express-jwt');

function authJwt(){
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL

    return jwt({
        secret:secret,
        algorithms:['HS256'],
        //isRevoked:isRevoked
    }).unless({

        path: [
                    {url:/\/api\/v1\/products(.*)/, methods:['GET', 'OPTIONS']},
                   { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
                    `${api}/users/login`,
                   `${api}/users/register`,
        ]
    })
}

// const isRevoked = async (req, payload, done) => {
//     //req = request
//     //payload = data

//     if (!payload.isAdmin) {
//         //reject token
//         done(null, true)
//     }

//     done()
// }
// async function isRevoked(req, payload, done) {
//     if (!payload.isAdmin) {
//         done(null, true)
//     }

//     done(null);
//}

module.exports = authJwt