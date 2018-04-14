


var SpreadsheetId  = '1XamrxyNC08EYGbGjZ5pe8p-RYZnAZLWh8x8jSncSRXw';

var DateColumn     = "A";
var ValueColumn    = "B";
var NameColumn     = "C";
var CategoryColumn = "D";
var MaxRecordIndex = 500;

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
		}, 
		  
		function(reason)
		{
			console.error('Error: ' + reason.result.error.message);
		}
	);
}

/**************************************** COMMON ***********************************************/
function GetFormattedDate() {
    var date = new Date();
	
	var str = date.getDate() + "." + (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1) + "." + date.getFullYear();
    return str;
}



