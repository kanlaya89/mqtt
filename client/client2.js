var mqtt = require('mqtt')
 
client = mqtt.connect('mqtt://localhost');

client.subscribe('presence');
client.publish('presence', 'Client 2 is alive.. Test Ping!' + Date());
 
client.on('message', function(topic, payload) {
  console.log(payload.toString());
});
 
console.log('Client started...');