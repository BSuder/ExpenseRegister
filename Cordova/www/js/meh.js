
var config = {
	apiKey: "AIzaSyCSq8EEMIB-9mPdyfl8oVYvGxUVjwHsRng",
	authDomain: "",
	databaseURL: "",
	storageBucket: "",
	messagingSenderId: ""
};

app.initialize();
firebase.initializeApp(config);


firebase.auth().onAuthStateChanged(
	function(user)
	{
		if (user)
		{
			alert("Logged in with: "+ user.email);
			console.log("onAuthStateChanged: logged IN");
		}
		else {
			alert('Logged out.');
			console.log("onAuthStateChanged: logged OUT");
		}
	}
);

function dummy()
{
	console.log("dummy()"); 
}
  

function login() 
{
	window.plugins.googleplus.login
	(
		{
			'webClientId' : '25809299563-3mrkg8k5gct981flgn20dvbkld1hr8gs.apps.googleusercontent.com',
			'offline': true
		},
		
		function(obj)
		{
			console.log("Login step 1 with: " + obj.displayName + ", " + obj.email);
			
			if(!firebase.auth().currentUser)
			{
				console.log("Login step 2");

				firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(obj.idToken)).then
				(
					function(success)
					{
						console.log("Login success: ");
						console.log(success);
					}
				)
				.catch
				(
					function(error)
					{
						console.log("Login error: ");
						console.log(error);
					}
				);
			}
			else
			{
				console.log("Login error: Already signed in database!");
			}
		},
		
		function(msg)
		{
			console.log("Login error: ");
			console.log(msg);
		}
	);
}


function trySilentLogin()
{
	window.plugins.googleplus.trySilentLogin
	(
		{
			'webClientId' : '25809299563-3mrkg8k5gct981flgn20dvbkld1hr8gs.apps.googleusercontent.com',
			'offline': true
		},
		
		function (obj)
		{
			console.log("Silent login success: " + obj.displayName + ", ", obj.email);
		},
		
		function (msg)
		{
			console.log("Silent login error: ");
			console.log(msg);
		}
	);
}

  
 
  
function logout()
{
	window.plugins.googleplus.logout
	(
		function(msg)
		{
			console.log("Logout step 1: ");
			console.log(msg);
			
			if(firebase.auth().currentUser)
			{
				console.log("Logout step 2.");
				firebase.auth().signOut();
			}
		},
		
		function(msg)
		{
			console.log("Logout fail: ");
			console.log(msg);
		}
	);
}

function disconnect()
{
	window.plugins.googleplus.disconnect
	(
		function(msg)
		{
			console.log("disconnect: ");
			console.log(msg);
			
			if(firebase.auth().currentUser)
			{
				
				console.log("disconnect: signout");
				firebase.auth().signOut();
			}
		},
		
		function(msg)
		{
			console.log("Disconnect fail: ");
			console.log(msg);
		}
	);
}

window.onerror = function(what, line, file)
{
	console.log("ERROR! " + what + '; ' + line + '; ' + file);
};

function handleOpenURL (url) {
	console.log("App opened by URL: " + url);
}
