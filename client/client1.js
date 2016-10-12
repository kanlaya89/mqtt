var mqtt = require('mqtt')

var now = '';
 
client = mqtt.connect('mqtt://localhost');

// ------------------------------
// Subscribed Topic list
client.subscribe('presence');
client.subscribe('get');

// ------------------------------
// On Topics
client.on('message', function(topic, payload) {
	if(topic === 'get') {

		startTime();
		var data = '{ "temp": 23, "hum": 60, "date": "' + now + '"' + '}';
		client.publish('send', data );
	}
  console.log(topic);
});

// ------------------------------
// Time
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    now = h + ":" + m + ":" + s;
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
 
console.log('Client publishing.. ');
client.publish('presence', 'Client 1 is alive.. Test Ping!' + Date());
// client.end();