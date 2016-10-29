// var mraa = require('mraa');
var http = require('http');
var pow = require('math-power');
var mqtt = require('mqtt');
var moment = require('moment');
var cron = require('cron');
// ------------------------------
// Connect Broker
client = mqtt.connect('mqtt://localhost:1883');

// ------------------------------
// Schedule Job
var every = 1;
var cronJob = cron.job('*/' + every + ' * * * * *', function(time){
  var now = moment().format('HH:mm:ss');
  var data = '{ "temp": 23, "hum": 60, "date": "' + now + '"' + '}';
    client.publish('send', data);
  console.log("run " + now);
});

// ------------------------------
// Subscribed Topic list
client.subscribe('presence');
client.subscribe('get');

// ------------------------------
// On Topics
client.on('message', function(topic, payload) {
  switch(topic) {
    case 'get' :
      console.log("consJob started")
      cronJob.start();
      break;
    case 'changeTime' :
      cronJob.end();
      every = 5;
      cronJob.start();
      break;
  }

  console.log(topic);
  console.log(payload);
});

// ------------------------------
// read analog
function read(){

    if (publishEnabled){

        var now = moment.format('hh:mm:ss');
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
     }
     setTimeout(read, 1000);
}
 
console.log('Client publishing.. ');
client.publish('presence', 'Edison is alive..' + Date());
// client.end();