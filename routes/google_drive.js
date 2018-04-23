var express = require('express');
var router = express.Router();
var google_drive_api = require('../model/google_drive_api');


/* GET home page. */


router.get('/auth/google',function(req,res,next){
	const Url = google_drive_api.oauth2Client.generateAuthUrl({
		ccess_type: 'offline',
		scope: google_drive_api.scopes,
	});
	res.redirect(Url);
});



router.get('/auth/google/return',function(req, res ,next){
    if ( !req.query.code ) {
        res.status(500).send('Authorization failed.');
        return;
    }
    
    var authorizationCode = req.query.code;
    google_drive_api.getAccessToken(authorizationCode, function(){
        res.redirect('/google_drive/index');
    });
});


router.get('/index', function(req,res){
	var authorised = google_drive_api.isAuthorised();
	
	if ( !authorised ) {
		res.render('google_drive/index',{authorised : false , title :'Google Drive '});
    }
	else{
		
		google_drive_api.getList('root', function(test){
			//console.log(test);
			var temp;
			for(let i=0;i<test.length;i++){
				if(test[i].mimeType=='application/vnd.google-apps.folder'){
					test[i].isfolder=true;
					test[i].folderURL='folder/'+test[i].id;
				}
				else{
					test[i].isfolder=false;
					test[i].file_link=test[i].id;
				}
			}
			
			res.render('google_drive/index', {title:' Google Drive', authorised: true,folderId: 'root',files: test});
        });
		
		//res.render('google_drive/index',{authorised : true , title :' Google Drive'});
	}
});
router.get('/logout',function(req,res){
	google_drive_api.oauth2Client.setCredentials({});
	res.redirect('/google_drive/index');
	

});
router.get('/folder/:folderId', function(req,res){
	
	var authorised = google_drive_api.isAuthorised();
	if ( !authorised ) {
		res.redirect('/google_drive/index');
    }
	var folderId =req.params.folderId?req.params.folderId:'root';
	
	google_drive_api.getList(folderId,function(test){
		for(let i=0;i<test.length;i++){
			if(test[i].mimeType=='application/vnd.google-apps.folder'){
				test[i].isfolder=true;
				test[i].folderURL=test[i].id;
				
			}
			else{
				test[i].isfolder=false;
				test[i].file_link='../'+test[i].id;
			}
		}
		res.render('google_drive/index',{ title:'Google Drive',authorised: true,folderId: folderId,files:test});
	});

});
router.get('/:fileId',function(req,res){
	var authorised = google_drive_api.isAuthorised();
	
	if(!authorised){
		
		res.redirect('/google_drive/index');
	}
	google_drive_api.downloadFile(req.params.fileId,function(test){
		console.log(test);
		var url=test;
		res.redirect(url);
	});

});




module.exports = router;


/*
exports.index = function(req, res){
    var authorised = files.isAuthorised();
    
    if ( authorised ) {
        files.getList('root', function(files){
            res.render('index', {
                authorised: true,
                folderId: 'root',
                files: files
            });
        });
    }
//    else {
        res.render('index', { authorised: false ,title: 'My Express'});
//    }
};
*/