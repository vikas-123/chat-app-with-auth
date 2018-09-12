var express = require('express'),
 app = express(),
 server = require('http').createServer(app),
 io = require('socket.io').listen(server);
 const router = express.Router();

 usernames = [];
 const {ensureAuthenticated} =require('../helper/auth');
 console.log(`Server running on 7000`);
 router.get('/' ,ensureAuthenticated, (req,res)=>{
 	res.render('chats/chat')
 	//
 }); 

 io.sockets.on('connection', function(socket){
 	console.log('socket connected');


 	socket.on('new user',function(data,callback){
 		if(usernames.indexOf(data) != -1){
 			callback(false);
 		}

 		else{
 			callback(true);
 			socket.username = data;
 			usernames.push(socket.username);
 			updateUsernames();
 		}
 	});function updateUsernames()
 	{
 		io.sockets.emit('usernames',usernames);
 	}




 	socket.on('send message' ,function(data){
 		io.sockets.emit('new message' , {msg : data,user:socket.username});
 	});

 	//disconnect evnt

 	socket.on('disconnect',function(data){
 		if(!socket.username)
 		{
 			return;
 		}

 		usernames.splice(usernames.indexOf(socket.username),1);
 		updateUsernames(); 
 	})
 } );


 server.listen(7000);

module.exports = router;