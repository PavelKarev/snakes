// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
 
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
 
// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});
 
// Запуск сервера
server.listen(5000, function() {
    console.log('Запускаю сервер на порте 5000');
});

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      xv: 0,
      yv: 0
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.xv = -1;
      player.yv = 0;
      // player.x -= 5;
    }
    if (data.up) {
      player.xv = 0;
      player.yv = -1;
      // player.y -= 5;
    }
    if (data.right) {
      player.xv = 1;
      player.yv = 0;
      // player.x += 5;
    }
    if (data.down) {
      player.xv = 0;
      player.yv = 1;
      // player.y += 5;
    }
  });
  io.sockets.emit('getId', socket.id);
});


setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 15);