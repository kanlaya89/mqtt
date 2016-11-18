// var mraa = require('mraa');
var BrokerIP = require("../config").BrokerIP
var http = require('http');
var pow = require('math-power');
var mqtt = require('mqtt');
var moment = require('moment');
var cron = require('cron');
var id = ""
//var every = 1;

// ------------------------------
// Connect Broker
client = mqtt.connect('mqtt://'+BrokerIP+':1883');

// ------------------------------
// Subscribed Topic list / subscribe with qos level
client.subscribe({'changeTime':1, 'get':1}, function(err, granted){
  if (err) {return console.log(err)}
  console.log(granted)
});

// var cronJob = cron.job('*/' + every + ' * * * * *', function(time){
//   var now = moment().format('HH:mm:ss');
//   var data = '{ "temp": 23, "hum": 60, "date": "' + now + '"' + '}';
//     client.publish('send', data);
//     console.log("run " + now);
// });


// ------------------------------
// read analog
function read(){

    

        var now = moment().format('hh:mm:ss');
        var a0 = analogPin0.read(); //read the value of the analog pin0
        var a1 = analogPin1.read();
        var v0 = a0*vcc/1024; // analog pin0 voltage
        var v1 = a1*vcc/1024;
        var r2 = r1*v1*(vcc-v1); // [Kohm]
         
        var temp = (v0*100).toFixed(1);
        // var ill = pow(r2/7.0, -1.49);
        var data = '{ "temp":'+temp+',"hum":'+v1.toFixed(2)+ ',"date": "'+now+'"}';
        client.publish('send', data );
         console.log(now + " ill:" + v1.toFixed(2));
     
     //setTimeout(read, 1000);
}




// ------------------------------
// On Topics
client.on('message', function(topic, message, packet) {
  //
  console.log("Topic:"+topic);
  console.log("qos:" + packet.qos)
  console.log("message: "+message.toString())

  switch(topic) {
    case 'get' :
      console.log("on Started")
      id = setInterval(pubFunc, 1000)
      //testFunc()
      break;
    case 'changeTime' :
      console.log("on ChangeTime")
      clearInterval(id) // clear the runing one
      // 
      every = message.toString() * 1000;
      console.log("every: "+every)
      id = setInterval(pubFunc, every)
      break;
      
  }

});

//
var pubFunc = function(){
  var now = moment().format('HH:mm:ss');
  var data = '{ "temp": 23, "hum": 60, "date": "' + now + '"' + '}';
  client.publish('send', data,{qos:1});
  console.log("run " + now);
}


//
var testFunc = function(){
  var now = moment().format('HH:mm:ss');
  var data = '{ "temp": 23, "hum": 60, "date": "' + now + '"' + '}';
  client.publish('send', data, {qos:2});  // publish with qos=2
}




