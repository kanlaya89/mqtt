var mosca = require('mosca');
var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var mqtt = require('mqtt');
var moment = require('moment');
var BrokerIP = require("./config").BrokerIP

var settings = {
  port: 1883,
  persistence: mosca.persistence.Memory
};



var clientConnected = false
var finished = false

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(express.static('public'));

var client = mqtt.connect('mqtt://' + BrokerIP);
client.subscribe('send');
client.subscribe('presence');


// -----------------------------------
//  send html
app.get('/', function (req, res) {

   res.sendFile(__dirname + "/public/html/index.html" );
});

// -----------------------------------
//  socket on
io.on('connection', function(socket) {

  
  if (clientConnected === false) {
    console.log("client connected")
    client.publish('get', '',{qos:1});

    socket.on('sensor', function(data) {
      getSensor(data);
    });
  }
  socket.on("changeTime", function(data){
     console.log(data)
      console.log("send changeTime mqtt message!!!!")

    client.publish("changeTime", data,{qos:1})
  })
  
  clientConnected = true
});

//
client.on('message', function(topic, message, qos) {

  console.log(topic, message.toString());
  if(topic === 'send') {
    io.emit('all_sensor', message.toString());
  };
});

//
var getSensor = function(sensor) {
  if (sensor === 'temp') {
    console.log("temp graph");
  } else if (sensor === 'ill') {
    console.log("ill graph");
  }
};




// listen on port 3000
http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


var Server =  new mosca.Server(settings, function(){
  console.log("mosca running")
})

