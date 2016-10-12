var app = angular.module('APP', []);
var socket = io.connect();
// -----------------------------------
//  Angular
app.controller('myCtrl', function($scope) {
	$scope.temp = function() {
		socket.emit('sensor', 'temp');
	};
	$scope.ill = function() {
		socket.emit('sensor', 'ill');
	};
});
// -----------------------------------
//  Socket
socket.on('all_sensor', function(payload) {

    var data = JSON.parse(payload);

    $('#showAll').text('Temp:' + data.temp + '  Hum:' +data.hum +'  updated:' + data.date);
});

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('now').innerHTML = h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}