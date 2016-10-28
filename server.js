var mosca = require('mosca');
var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var mqtt = require('mqtt');
test

var settings = {
  port: 1883,
  persistence: mosca.persistence.Memory
};

var clientConnected = false

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(express.static('public'));

client = mqtt.connect('mqtt://localhost');
client.subscribe('send');

client.on('message', function(topic, message, qos) {
  console.log(topic, message.toString());
  if(topic === 'send') {
    io.emit('all_sensor', message.toString());
  };
});

// -----------------------------------
//  send html
app.get('/', function (req, res) {
   res.sendFile(__dirname + "/public/html/index.html" );
});
// listen on port 3000
http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
// -----------------------------------
//  socket on
io.on('connection', function(socket) {
  
  if (clientConnected === false) {
    console.log("client connected")
    client.publish('get', '');
    socket.on('sensor', function(data) {
      getSensor(data);
    });
  }
  

  clientConnected = true
});

client.subscribe('presence');
var getSensor = function(sensor) {
  if (sensor === 'temp') {
    console.log("temp graph");
  } else if (sensor === 'ill') {
    console.log("ill graph");
  }
};




var server = new mosca.Server(settings, function() {
  console.log('Mosca server is up and running')
});
 
server.published = function(packet, client, cb) {
  if (packet.topic.indexOf('echo') === 0) {
    return cb();
  }
 
  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    retain: packet.retain,
    qos: packet.qos
  };
 
  // console.log('newPacket', newPacket);
  
  server.publish(newPacket, cb);
}