// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
 
app.set('port', 5000);
app.use('/public', express.static(__dirname + '/public'));
 
// Маршруты
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

// Запуск сервера
server.listen(5000, function() {
    console.log('Запускаю сервер на порте 5000');
});

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      px: 10,
      py: 10,
      gs: 20,
      tc: 20,
      ax: 15,
      ay: 15,
      xv: 0,
      yv: 0,
      trail: [],
      tail: 5,
      init: function init(player) {
        this.px += player.xv;
        this.py += player.yv;

        if(this.px < 0) {
            this.px = this.tc-1;
        }
        if(this.px > this.tc-1) {
            this.px= 0;
        }
        if(this.py < 0) {
            this.py= this.tc-1;
        }
        if(this.py > this.tc-1) {
            this.py= 0;
        }

        this.trail.push({x: this.px, y: this.py });
        while(this.trail.length > this.tail) {
        this.trail.shift();
        }
    
        if(this.ax == this.px && this.ay == this.py) {
            this.tail++;
            this.ax=Math.floor(Math.random() * this.tc);
            this.ay=Math.floor(Math.random() * this.tc);
        }
      }
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
    player.init(player);
  });
  io.sockets.emit('getId', socket.id);
});


setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 15);