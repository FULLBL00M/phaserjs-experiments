const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log(`user connected ID:${socket.id}`);
  // var playersElement = document.getElementById('players');
  
  // create a new player and add it to our players object
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  };
  
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);
  console.log(`Active Users: ${Object.keys(players).length}`);
    
  socket.on('disconnect', function () {
    console.log(`user disconnected ID:${socket.id}`);
    // remove this player from our players object
    socket.disconnect();
    delete players[socket.id];
    // emit a message to all players to remove this player
    // io.emit('disconnect', socket.id);
    console.log(`Active Users: ${Object.keys(players).length}`);
  });
});

var players = {};

server.listen(8082, function () {
  console.log(`Listening on http://127.0.0.1:${server.address().port}`);

});
