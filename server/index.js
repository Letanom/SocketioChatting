const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { connect } = require('http2');
app.use(cors());

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: 'http://localhost:3000',//which url,server is calling - which is running
        methods: ['GET','POST'], // allowed methods on that domain

    },
});
io.on("connection",(socket)=>{
    console.log(`User Connected: ${socket.id}`);
    socket.on("join_room",(data)=>{ //pass for front end
        socket.join(data) 
        console.log(`User with Id: ${socket.id} joined room: ${data}`)
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message",data);
        console.log(data);
    }); 
    
    socket.on("disconnect",()=>{
        console.log("User Left",socket.id);
    })
});

server.listen(3001, () => {
    console.log(`Listening on port 3000`);  
});