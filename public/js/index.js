var app = angular.module('APP', []);
var socket = io.connect();
// -----------------------------------
//  Angular
app.controller('myCtrl', function($scope) {
    //$scope.selectedTime = null
    //console.log($scope.selectedTime)


	$scope.temp = function() {
		socket.emit('sensor', 'temp');
	};
	$scope.ill = function() {
		socket.emit('sensor', 'ill');
	};

    $scope.data = {
        selectedTime : null,
        times: [
        {model: "1s"},
        {model: "5s"},
        {model: "10s"}]
    };

    $scope.onSelectChange = function(){
        
        console.log($scope.selectedTime)
    }
    
    
    
});
// -----------------------------------
//  Socket
socket.on('all_sensor', function(payload) {

    var data = JSON.parse(payload);

    $('#showAll').text(data.date + ' temp:' + data.temp + '  ill:' +data.hum);
});

function startTime() {
    document.getElementById('now').innerHTML = moment().format('HH:mm:ss');
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}