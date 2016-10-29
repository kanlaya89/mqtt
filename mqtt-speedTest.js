var BrokerIP = require("./config").BrokerIP
var mqtt = require('mqtt');
var moment = require('moment');
var _qos = 1

var client = mqtt.connect('mqtt://'+BrokerIP+':1883');
client.subscribe({'send':2});	// subscribe with qos=1

//
client.on('message', function(topic, message, packet) {

	console.log("qos:" + packet.qos)

 if (topic === "send") {
	  var d2 = new Date()
	  //console.log(d2)
	  var diff = Math.abs(d2 - d1)	// different in millisecond
	  console.log(diff)

	  //console.log("Data: " + message.toString())
 }
  
});

//
var pubFunc = function(){
	d1 = new Date()
	client.publish('get', 'aman',{qos:1});
}
setInterval(pubFunc, 1000)

pubFunc()










