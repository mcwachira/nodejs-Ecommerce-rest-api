const errorHandling = (err, eq, res, next) =>{
if(err.name === "Unauthorized access"){
    //jwt token
    return res.status(401).json({message:'the used is not authorized'})
}
if(err.name === "Validation err"){


    //validation err
        return res.status(401).json({ message:err })
    } 

    //server err
    return res.status(500).json({err})
}


