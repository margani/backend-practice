var express = require('express');
var path = require('path');
var router = express.Router();



/* GET home page. */



router.get('/' ,function(req, res){
   
   
    res.render('index', { authorised: false ,title: 'My Practice'});
	
	
});
router.get('/google99ba527390da12f0.html',function(req,res){
	//res.render('google99ba527390da12f0.html');
	res.sendFile(path.join(__dirname+'/google99ba527390da12f0.html'));
});
module.exports = router;