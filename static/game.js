var socket = io();
socket.on('message', function(data) {
    console.log(data);
});

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}


function NewGame() {
  console.log('new game');
}

NewGame.prototype = {
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

    context.fillStyle="lime";
    for(var i = 0; i < this.trail.length; i++) {
      context.fillRect(this.trail[i].x * this.gs, this.trail[i].y * this.gs, this.gs - 2, this.gs - 2);

      if(this.trail[i].x == this.px && this.trail[i].y == this.py) {
        this.tail = 5;
      }
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
    context.fillStyle="red";
    context.fillRect(this.ax * this.gs, this.ay * this.gs, this.gs-2, this.gs-2);
  }
}



document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // left
      movement.left = true;
      break;
    case 38: // up
      movement.up = true;
      break;
    case 39: // right
      movement.right = true;
      break;
    case 40: // down
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37: // left
      movement.left = false;
      break;
    case 38: // up
      movement.up = false;
      break;
    case 39: // right
      movement.right = false;
      break;
    case 40: // down
      movement.down = false;
      break;
  }
});

socket.emit('new player');


setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 15);

var canvas = document.getElementById('canvas');
canvas.width = 400;
canvas.height = 400;

var context = canvas.getContext('2d');

var newGame = new NewGame();


socket.on('state', function(players) {
  context.clearRect(0, 0, 400, 400);
  context.fillStyle="black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (var id in players) {
    var player = players[id];

    context.fillStyle="lime";
    for(var i = 0; i < player.trail.length; i++) {
      context.fillRect(player.trail[i].x * player.gs, player.trail[i].y * player.gs, player.gs - 2, player.gs - 2);

      if(player.trail[i].x == player.px && player.trail[i].y == player.py) {
        player.tail = 5;
      }
    }
    context.fillStyle="red";
    context.fillRect(player.ax * player.gs, player.ay * player.gs, player.gs-2, player.gs-2);
    
  }
});