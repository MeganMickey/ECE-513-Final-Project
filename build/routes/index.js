// This is the express connection
const { application } = require('express');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) { 
    
    //res.sendFile(path.join(__dirname + '/index.html'));
    //res.render('index', {title: 'Express'});
    res.render('index', {title: 'Esxpress'});


});

router.get('/welcome', (req, res, next) => {
    res.render('index', {title: 'Esxpress'});
});

module.exports = router;
