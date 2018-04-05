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
/*
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
      client_id: '323290425508-dkhisu6b0pfqe45e6s7u5bjjpk146ghq',
      client_secret: 'ZfqRRdj0kVoD6t9iloHVNVgO',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      scope: 'SPACE SEPARATED LIST OF SCOPES'
    }).done(function(data) {
      $loginStatus.html('Access Token: ' + data.access_token);
    }).fail(function(data) {
      $loginStatus.html(data.error);
    });
  });
});*/