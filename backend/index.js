const server = require('http').createServer();
const redis = require('redis');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

const subscriber = redis.createClient();
const publisher = redis.createClient();

subscriber.subscribe('message', 'typing');

io.on('connection', (socket) => {  
  console.log(socket.id);

  /**
   * Listens message channel from socket
   * Publish the message that comes from the socket to the redis.
   */
  socket.on('message', (payload) => {
    console.log(payload);
    publisher.publish('message', JSON.stringify(payload));
  });

  /**
   * Listens typing channel from socket
   * Publish the message that comes from the socket to the redis.
   */
   socket.on('typing', (payload) => {
    publisher.publish('typing', JSON.stringify(payload));
  });
});

/**
   * Listens message channel from redis.
   * Send messages to clients via socket.io
   */
subscriber.on('message', (channel, message) => {
  io.emit(channel, JSON.parse(message));
});

/**
   * Listens message channel from redis.
   * Send messages to clients via socket.io
   */
 subscriber.on('typing', (channel, message) => {
  io.emit(channel, JSON.parse(message));
});


const port = process.argv[2] || process.env.PORT || '8090';

server.listen(port, () => {
  console.log('Server started: '+ port);
});