var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var axios = require('axios');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const clients = new Set();
const adminRoomName = 'admin-view';

io.on('connection', function(socket) {
  clients.add(socket);
  console.log('user connection');
  const defaultPositions = {
    position: {
      latitude: 55,
      longitude: 55,
    },
  };
  socket.on('message-coordinates', (from, msg = defaultPositions) => {
    console.log('from', from);
    console.log('mag', msg);
    socket.broadcast.emit('message-coordinates', {
      coordinates: {
        lat: msg.position.latitude,
        lon: msg.position.longitude,
      }
    });
  });
  socket.on('message', (from, msg) => {
    console.log('from', from);
    console.log('msg', msg);
    if (from === 'admin') {
      // const adminRoomName = 'admin-view';
      socket.join(adminRoomName);
      let count = 0;
      const intervar = setInterval(() => {
        if (count === 10) {
          clearInterval(intervar);
        }
        io.to(adminRoomName).emit('message-coordinates', {
          id: socket.id,
          coordinates: {
            // lat: Number(`55.75${count}`),
            // lon: Number(`37.57${count}`),
            lat: Number(`${msg.lat}${count}`),
            lon: Number(`${msg.lon}${count}`),
          },
        });
        count += 1;
        return false;
      }, 1000);
      io.to(adminRoomName).emit('message', 'admin-room-message');
    }
    // console.log('else');
    // io.to(adminRoomName).emit('message-coordinates', {
    //   coordinates: {
    //     lat: Number(msg.lat),
    //     lon: Number(msg.lon),
    //   }
    // });
    // console.log('tttt');
    // socket.to(adminRoomName).emit('message-coordinates', {
    //   coordinates: {
    //     lat: Number(msg.lat),
    //     lon: Number(msg.lon),
    //   }
    // });
    // socket.emit('message', {
    //   coordinates: {
    //     lat: Number(msg.lat),
    //     lon: Number(msg.lon),
    //   }
    // });
    console.log('broadcast')
    // socket.broadcast.emit('message-coordinates', {
    //   coordinates: {
    //     lat: msg.position.latitude,
    //     lon: msg.position.longitude,
    //   }
    // });
    socket.broadcast.emit('message', 'admin connect');
  })
  // socket.broadcast.to
  // socket.broadcast.emit('message', 'broadcast.emit');
  // socket.on('my other event', function(from, msg) {
  //   if (from === 'admin') {
  //     console.log('connection join');
  //     socket.join('admin-view');
      
  //   } else {
  //     // io.to('admin-view').emit('newMessage', 'admin-view');
  //   }
  //   console.log('I received a private message by ', from, ' saying ', msg);
  // });
  // socket.broadcast.to('admin-view').emit('room-message', 'join to room');

  // socket.on('message', (from, msg) => {
  //   axios.post('http://localhost:5000/setUserOnlineCoordinates', {
  //     ...JSON.parse(msg),
  //   }).then((response) => {
  //     // console.log('response', response);
  //     io.emit('receiveMessage', {
  //       from: 'server',
  //       text: 'test',
  //       time: new Date().getTime()
  //     });
  //     io.emit('personalMessage', {
  //       text: 'personal-mesage',
  //     });
  //   });
  // });

  // socket.on('user-new-coord', (name) => {
  //   console.log('name', name);
  // })

  socket.on('disconnect', function() {
    clients.delete(socket);
    console.log('user disconnected');
  });
});

http.listen(3002, function(){
  console.log('listening on *:3002');
});