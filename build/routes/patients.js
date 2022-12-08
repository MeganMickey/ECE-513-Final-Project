const express = require('express');
let router = express.Router();


router.post("/signUp", function(req,res){
    res.status(201).send("Created!");
})


module.exports = router;