const { convertTextToObject } = require('./utils/messages')
const { joinNewUser ,getUser, removeUser,getAllUsers,getRoomUsers} = require('./utils/users')

const express = require('express')
const http = require('http')
const socketio= require('socket.io')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
const bot = "Chat Labs Admin"
let i = 1;
io.on('connection',(socket)=>{

    socket.on('join-room',(userObj)=>{
        if(userObj.room ==="Personal" && getRoomUsers(userObj.room).length>1) {
            return socket.emit('busy')
        }
        
       
        //personal not busy or all other rooms ,then //join the room 
        socket.join(userObj.room)
        
        //add user to the total users array
        let user = joinNewUser(socket.id,userObj.username,userObj.room)

       

        if(!user){
            return socket.emit('con_brk')
        }
        if(userObj.back===1){
             //Upon reconnecting
            socket.emit('message',convertTextToObject(bot,`Welcome Back ${userObj.username} . Kindly resend your last message.`))

            //Tell everyone about new user joined
            socket.broadcast.to(userObj.room).emit('message',convertTextToObject(bot,`${userObj.username} was disconnected but is back in ${userObj.room}`))
        }
        else{

            //Welcome new user
            socket.emit('message',convertTextToObject(bot,`Welcome ${userObj.username}`))

            //Tell everyone about new user joined
            socket.broadcast.to(userObj.room).emit('message',convertTextToObject(bot,`${userObj.username} has joined ${userObj.room}`))
        }

         //update the side bar
         io.to(userObj.room).emit('upd_sidebar',{
            room: userObj.room,
            roomUsers : getRoomUsers(userObj.room)})
        
    
    })

    socket.on('chatMsg',(msgText)=>{
        //get user from socketId
        let userObjFound =  getUser(socket.id)

        if(userObjFound){
            io.to(userObjFound.room).emit('message',convertTextToObject(userObjFound.userName,msgText))
        }
        else{ //when connection breaks but tab not closed
            socket.emit('con_brk')
        }
        
    })
    

   // joinNewUser(socket.id,username,room)
    //Tell all when he exits
    
    socket.on('disconnect',()=>{
        let userObjFound =  getUser(socket.id)
        if(userObjFound){
            //remove user from the total users array
            let userLeft = removeUser(socket.id)
            if(userLeft){
                io.to(userLeft.room).emit('message',convertTextToObject(bot,`${userLeft.userName} left the chat`))
            }

            //update the side bar
            io.to(userObjFound.room).emit('upd_sidebar',{
            room: userObjFound.room,
            roomUsers : getRoomUsers(userObjFound.room)})
        }
    })
    
   
})

app.use('/',express.static(__dirname+'/public'))


server.listen(5555,()=>{
    console.log('server started at http://localhost:5555')
})