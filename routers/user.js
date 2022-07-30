const User = require('../models/user');
const express=  require('express');

const router = express.Router();

router.get("/", async (req, res) => {
    const UserList = await User.find();
    if(!UserList){
        res.status(500).json({success:false})
    }
    res.send(UserList)
})


module.exports = router