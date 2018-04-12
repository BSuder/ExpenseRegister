var provider = new firebase.auth.GoogleAuthProvider();

function init() {
	
	 window.plugins.googleplus.trySilentLogin();
	document.addEventListener("deviceready",onDeviceReady, false);
	
}

function onDeviceReady() {
	navigator.notification.beep(1);
}

function deviceInfo() {

	info =  'Hi, I am your smartphone :-)' + '\n' +
			'=====' + '\n' +
			'Device Name    : '     + device.name     + '\n' + 
			'Device Cordova : '  + device.cordova + '\n' + 
			'Device Platform: ' + device.platform + '\n' + 
			'Device UUID    : '     + device.uuid     + '\n' + 
			'Device Model   : '    + device.model     + '\n' + 
			'Device Version : '  + device.version  + '\n';

	navigator.notification.alert(info);
	
}

function HTMLtext(){
	var basicGoogleURL = document.getElementById("lololo").value;
	var xmlHttp = new XMLHttpRequest();

    xmlHttp.open( "GET", "https://www.google.pl", false ); // false for synchronous request, wstrzymuje dzialanie apki
	// jest true trzeba czekac az sie wykona
    xmlHttp.send( null );

    navigator.notification.alert(xmlHttp.responseText);
}

  $login.on('click', firebase.auth().signInWithRedirect(provider););

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

var googleapi = {
    authorize: function(options) {
        var deferred = $.Deferred();
        deferred.reject({ error: 'Not Implemented' });
        return deferred.promise();
    }
};

$(document).on('deviceready', function() {
  var $loginButton = $('#login a');
  var $loginStatus = $('#login p');

  $loginButton.on('click', function() {
    googleapi.authorize({
      client_id: '323290425508-nhdtn6u9qo2b07hukv3smfio21a4clbj',
      client_secret: '18sjzLFeptAtBEIhOuRqkkdR',
      redirect_uri: 'https://console.developers.google.com/apis/credentials',
      scope: ''
    }).done(function(data) {
      $loginStatus.html('Access Token: ' + data.access_token);
    }).fail(function(data) {
      $loginStatus.html(data.error);
    });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// retrieve efforts by:
/*
	default -> current month
	selected date range
	category
	created by
*/


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create and send message to insert new row 

/*
//	WORKFLOW:

//	get range of total cells
//	create message
//	send message

	//	helper functions:

	//	genegateInputMessage
	//	generateTimestamp
	//	
*/

function sendInsertMessage(){
	
	// todo:
	// funkcja pobierajaca ilosc rekordow
	
	var xmlHttp = new XMLHttpRequest();

    xmlHttp.open( "POST", "https://www.google.pl", false ); // false for synchronous request, wstrzymuje dzialanie apki
	// jest true trzeba czekac az sie wykona
    xmlHttp.send( null );

    navigator.notification.alert(xmlHttp.responseText);
}

function generateInputMessage( categoty, descr, vlaue, User){
	
	var Message ={
	  "major_dimension" => "ROWS",
	  "values" => [
		 [categoty,descr,value,User, generateTimestamp()],
	   ]
	};

	return Message; 
}

function generateTimestamp(){
	var timestamp = new Date().getTime();
	return timestamp;
}

function convertDateToTimestamp(year, month, day){
	var newTimestamp = (year-1970)*31556926000 + (month-1)*2629743000 + (day-1)*86400000;
	return newTimestamp;
}