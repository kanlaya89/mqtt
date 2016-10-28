// var mraa = require('mraa');
var http = require('http');
var pow = require('math-power');
var mqtt = require('mqtt');
var moment = require('moment');
var cron = require('cron');

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
// Connect Broker
client = mqtt.connect('mqtt://192.168.11.201:1883');

// ------------------------------
// Subscribed Topic list
client.subscribe('presence');
client.subscribe('get');

// var now;
// var analogPin0 = new mraa.Aio(0); //setup access analog input Analog pin #0 (A0)
// var analogPin1 = new mraa.Aio(1);
// var vcc = 4.6; // input volt
// var r1 = 10.0; // [Kohm]
// var publishEnabled = false;

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
// read();

// ------------------------------
// On Topics
client.on('message', function(topic, payload) {
  switch(topic) {
    case 'get' :
      cronJob.start();
      break;
    case 'changeTime' :
      cronJob.end();
      every = 5;
      cronJob.start();
      break;
  }
    // if(topic === 'get') {
    //   // publishEnabled = true;
    //   time = 1;
    //   cronJob.start();
    // }
  console.log(topic);
  console.log(payload);
});

// ------------------------------
// Time
// function startTime() {
//     var today = new Date();
//     var h = today.getHours();
//     var m = today.getMinutes();
//     var s = today.getSeconds();
//     m = checkTime(m);
//     s = checkTime(s);
//     now = h + ":" + m + ":" + s;
// }
// function checkTime(i) {
//     if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
//     return i;
// }
 
console.log('Client publishing.. ');
client.publish('presence', 'Edison is alive..' + Date());
// client.end();