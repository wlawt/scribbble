var app = require('express')();
var http = require('http').createServer(app);
var io = require("socket.io")(http, {
  cors: {
    origin: '*'
  }
})

const STATIC_CHANNELS = ['global_notifications', 'global_chat'];

const PORT = 8080;

io.on('connection', (socket) => {
  console.log('new client connected');
  socket.emit('connection', null);

  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});