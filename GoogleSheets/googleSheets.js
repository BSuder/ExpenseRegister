
var CLIENT_ID = '1074999519337-t50r3n6n5ah72fhpqp8d2p423pp74h9b.apps.googleusercontent.com'; // Client ID and API key from the Developer Console
var API_KEY = 'AIzaSyD3XijftSrbAfYxGkmTq-hT48Uium9UWk0';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"]; // Array of API discovery doc URLs for APIs used by the quickstart
var SCOPES = "https://www.googleapis.com/auth/spreadsheets"; // Authorization scopes required by the API; multiple scopes can be included, separated by spaces.


var SpreadsheetId  = '1Lk2Ni4po21fw1tbQp_4jL1kWcwapBil2OF3N2gMZmxs';

var DateColumn     = "A";
var ValueColumn    = "B";
var NameColumn     = "C";
var CategoryColumn = "D";
var MaxRecordIndex = 500;

var SummaryPosition = "G2:G10"

var StartPosition   = 0;
var EndPosition     = 1;
var IncomePosition  = 3;
var OutcomePosition = 4;
var LimitPosition   = 6;
var BalancePosition = 8;


/************************************ ADD EXPENSE *******************************************/

function AddExpense(value, name, category)
{	
	var recordIndex

	// Search first free record
	gapi.client.sheets.spreadsheets.values.get( {spreadsheetId:SpreadsheetId, range:("B1:B" + MaxRecordIndex)} ).then
	(
		function(response)
		{
		  recordIndex = (response.result.values ? response.result.values.length : 0) + 1;
		  
		  console.log("First free record found at: " + recordIndex);
		  SendExpense(value, name, category, recordIndex)
		},
		
		function(reason)
		{
			console.error('Error: ' + reason.result.error.message);
		}
	);
}

function SendExpense(value, name, category, recordIndex)
{
	var coordinates = DateColumn + recordIndex + ":" + CategoryColumn + recordIndex;
	var body = {"range":coordinates, "majorDimension":"ROWS", "values":[[GetFormattedDate(), value, name, category]]};
	
	console.log(GetFormattedDate());
	
	gapi.client.sheets.spreadsheets.values.update( {spreadsheetId:SpreadsheetId, range:coordinates, valueInputOption:'USER_ENTERED'}, body).then
	(
		function(response)
		{
			console.log(response.result);
			CheckLimit();
		}, 
		  
		function(reason)
		{
			console.error('Error: ' + reason.result.error.message);
		}
	);
}

function CheckLimit()
{
	var outcome;
	var limit;
	
	gapi.client.sheets.spreadsheets.values.get( {spreadsheetId:SpreadsheetId, range:SummaryPosition} ).then
	(
		function(response)
		{
			limit = response.result.values[LimitPosition];
			outcome = response.result.values[OutcomePosition];
			
			if((limit == 0) || (limit == null))
			{
				return;
			}
			
			if(outcome > limit)
			{
				alert("WARNING! Expense limit reached!");
			}
		}, 
		  
		function(reason)
		{
			console.error('Error: ' + reason.result.error.message);
		}
	);
}

/************************************* AUTHORIZATION ********************************************/

function handleClientLoad() // On load, called to load the auth2 library and API client library.
{
  gapi.load('client:auth2', initClient);
}

function initClient() // Initializes the API client library and sets up sign-in state listeners.
{
	gapi.client.init( {apiKey:API_KEY, clientId:CLIENT_ID, discoveryDocs:DISCOVERY_DOCS, scope:SCOPES} ).then
	(
		function()
		{
		  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus); // Listen for sign-in state changes.
		  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()); // Handle the initial sign-in state.
		}
	);
}

function updateSigninStatus(isSignedIn) // Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
{
	if(isSignedIn)
	{
		document.getElementById('authorize-button').style.display = 'none';
		document.getElementById('signout-button').style.display = 'block';
	}
	else
	{
		document.getElementById('authorize-button').style.display = 'block';
		document.getElementById('signout-button').style.display = 'none';
	}
}

function handleAuthClick() // Sign in the user upon button click.
{
	gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() // Sign out the user upon button click.
{
	gapi.auth2.getAuthInstance().signOut();
}


/**************************************** COMMON ***********************************************/

function GetFormattedDate() {
    var date = new Date();
	
	var str = date.getDate() + "." + (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1) + "." + date.getFullYear();
    return str;
}



