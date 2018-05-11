
var CLIENT_ID = '1074999519337-t50r3n6n5ah72fhpqp8d2p423pp74h9b.apps.googleusercontent.com'; // Client ID and API key from the Developer Console
var API_KEY = 'AIzaSyD3XijftSrbAfYxGkmTq-hT48Uium9UWk0';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]; // Array of API discovery doc URLs for APIs used by the quickstart
var SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata.readonly"; // Authorization scopes required by the API; multiple scopes can be included, separated by spaces.

var TemplateCheckString = "ExpenseRegisterTemplate by EleteleTeam";

var NewSpreadsheet = 0;

var SpreadsheetId  = '1-PonsTBfd4TdHjbIZiA5Zz8tm42-AJ2eMDllMraYnt4';
var TemplateSheetId = '1sme9DQeCuH1fuZCV_gU2I4dziQ_Kt4tS_rHe2kCTbZc'

var DateColumn     = "A";
var ValueColumn    = "B";
var NameColumn     = "C";
var CategoryColumn = "D";
var MaxRecordIndex = 500;

var LimitCellPosition = "G8";

var OutcomeCategoriesPosition = "I2:I21";
var IncomeCategoriesPosition  = "L2:L21";

var OutcomeCategoryColumn = "I";
var IncomeCategoryColumn = "L";

var IncomeCategoryList = {};
var OutcomeCategoryList = {};

var MaxCategoryIndex = 21;



var ExpenseListPosition = "A2:D500";
var ExpenseList = {};

var TemplateSheetName = "newTemplate";

var SheetList = [];
var SpreadsheetList;
var CurrentSheetName = "";

var StartPosition   = 0;
var EndPosition     = 1;
var IncomePosition  = 3;
var OutcomePosition = 4;
var LimitPosition   = 6;
var BalancePosition = 8;

var OutcomeCatSummaryPosition = "I2:J21";
var IncomeCatSummaryPosition = "L2:M21";
var SummaryPosition = "G2:G10";

var SummaryList = {};
var OutcomeSummary = {};
var IncomeSummary = {};

function GetLocalOutcomeSummary()
{
	var outList = [];
	
	for(i = 0; i < OutcomeSummary.length; i++)
	{
		if(OutcomeSummary[i][0] == "")
		{
			outList = slice(0,i);
			
			console.log(outList);
			
			return outList;
			
			
		}
	}
	
	return OutcomeSummary;
}

function GetLocalIncomeSummary()
{
	var outList = [];
	
	for(i = 0; i < IncomeSummary.length; i++)
	{
		if(IncomeSummary[i][0] == "")
		{
			outList = slice(0,i);
			
			console.log(outList);
			
			return outList;
			
			
		}
	}
	
	return IncomeSummary;
}



function GetLocalSummaryStart(){return SummaryList[StartPosition];}
function GetLocalSummaryEnd(){return SummaryList[EndPosition];}
function GetLocalSummaryIncome(){return SummaryList[IncomePosition];}
function GetLocalSummaryOutcome(){return SummaryList[OutcomePosition];}
function GetLocalSummaryLimit(){return SummaryList[LimitPosition];}
function GetLocalSummaryBalance(){return SummaryList[BalancePosition];}

function GetLocalOutcomeCategories(){return OutcomeCategoryList;}
function GetLocalIncomeCategories(){return IncomeCategoryList;}

function GetLocalMonthList()
{
	
	var list = [];


	for(i = 0; i < SheetList.length; i++)
	{
		list.push(SheetList[i].properties.title);
	}
	console.log("Month list ????");
	console.log(list);
	return list;
	
}

function LocalSpreadsheetList()
{
	return SpreadsheetList;
}

function LocalExpenseList()
{
	return ExpenseList;
}

/************************************** ON LOAD *********************************************/
function OnWebpageLoad()
{
	UpdateCategoryLists(UpdateSheetList);
	
	
	//UpdateCurrentExpenseList();
}

/************************************ ADD EXPENSE *******************************************/

function AddExpense(value, name, category)
{	
	var categoryFound = 0;
	var recordIndex
				
	for(i = 0; i < IncomeCategoryList.length; i++)
	{
		if(IncomeCategoryList[i] == category)
		{
			categoryFound = 1;
			break;
		}
	}
	
	for(i = 0; i < OutcomeCategoryList.length; i++)
	{
		if(OutcomeCategoryList[i] == category)
		{
			categoryFound = 1;
			break;
		}
	}
	
	if(categoryFound == 0)
	{
		alert("Category '" + category + "' not found!");
		return;
	}
	
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
			alert("Expense added: " + value + ", " + name + ", " + category + ".");
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

function SetExpenseLimit(value)
{
	var body = {"range":LimitCellPosition, "majorDimension":"ROWS", "values":[[value]]};
		
	gapi.client.sheets.spreadsheets.values.update( {spreadsheetId:SpreadsheetId, range:LimitCellPosition, valueInputOption:'USER_ENTERED'}, body).then
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


/************************************ SHEET MANAGEMENT *******************************************/
function AddNewMonthSheet(callback) 
{
	var params = 
	{
		spreadsheetId: TemplateSheetId,
		sheetId: 0,
	};

	var copySheetToAnotherSpreadsheetRequestBody = 
	{
		destinationSpreadsheetId: SpreadsheetId,
	};

	gapi.client.sheets.spreadsheets.sheets.copyTo(params, copySheetToAnotherSpreadsheetRequestBody).then
	(
		function(response)
		{
			console.log(response.result.sheetId);
			
			NameNewTemplate(response.result.sheetId, callback);
		}, 
		
		function(reason) 
		{
			console.error('error: ' + reason.result.error.message);
		}
	);
}

function NameNewTemplate(id, callback)
{	
	var name = GenerateSheetName();

	var params = 
	{
		spreadsheetId: SpreadsheetId,
	};
	
	var batchUpdateSpreadsheetRequestBody = 
	{
		requests: 
		[
			{
				"updateSheetProperties": 
				{  
					"properties": 
					{
						"sheetId": id,
						"title": name,
						"index": 0,
					},
					
					"fields": "title, index",
				},
			}
		],
	};

	gapi.client.sheets.spreadsheets.batchUpdate(params, batchUpdateSpreadsheetRequestBody).then
	(
		function(response)
		{
			console.log(response.result);
			UpdateSheetList();
			
			if(NewSpreadsheet == 0)
			{
				ImportCategoriesToNewSheet();
			}
			else
			{
				SaveSpreadsheetToFirebase();
				DeleteDefaultSheet(callback);
			}
		}, 
		
		function(reason) 
		{
			console.error('error: ' + reason.result.error.message);
		}
	);	
}

function UpdateSheetList(callback)
{
	gapi.client.sheets.spreadsheets.get({spreadsheetId: SpreadsheetId}).then
	(
		function(response) 
		{
			SheetList = response.result.sheets;
			
			console.log("Sheets updated:");
			
			for(i = 0; i < SheetList.length; i++)
			{
				console.log(SheetList[i].properties);
			}
			
			CurrentSheetName = SheetList[0].properties.title;
			
			if(CurrentSheetName != GenerateSheetName())
			{
				NewSpreadsheet = 0;
				AddNewMonthSheet();
				return;
			}
			
			UpdateCategoryLists(callback);
		}, 

		function(response) 
		{
			console.log('Error: ' + response.result.error.message);
		}
	);
}

function ImportCategoriesToNewSheet()
{
	console.log("Importing categoriees" + OutcomeCategoryList);
	
	var coordinates = OutcomeCategoriesPosition;
	var body = {"range":coordinates, "majorDimension":"ROWS", "values":OutcomeCategoryList};
		
	gapi.client.sheets.spreadsheets.values.update( {spreadsheetId:SpreadsheetId, range:coordinates, valueInputOption:'USER_ENTERED'}, body).then
	(
		function(response)
		{
			console.log(response.result);
			
			coordinates = IncomeCategoriesPosition;
			body = {"range":coordinates, "majorDimension":"ROWS", "values":IncomeCategoryList};
				
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
		}, 
		  
		function(reason)
		{
			console.error('Error: ' + reason.result.error.message);
		}
	);
}

function GenerateSheetName()
{
	var date = new Date();
	return ((date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1) + "." + (date.getYear() - 100));
	//return "06.18";
	
}

/********************************* SPREADSHEET MANAGEMENT ****************************************/


function CreateNewSpreadsheet(name, callback) {
	
	gapi.client.sheets.spreadsheets.create({},{"properties": {"title": name}}).then
	(
		function(response)
		{
			console.log(response.result);
			SpreadsheetId = response.result.spreadsheetId;
			NewSpreadsheet = 1;
			AddNewMonthSheet(callback);
		}, 
		
		function(reason)
		{
			console.error('error: ' + reason.result.error.message);
		}
	);
}

function SaveSpreadsheetToFirebase()
{
	console.log("SAVE TO FIREBASE");
}

function DeleteDefaultSheet(callback)
{
	var params = 
	{
		spreadsheetId: SpreadsheetId,
	};
	
	var batchUpdateSpreadsheetRequestBody = 
	{
		requests: 
		[
			{
				"deleteSheet":{"sheetId": 0}
			}
		],
	};

	gapi.client.sheets.spreadsheets.batchUpdate(params, batchUpdateSpreadsheetRequestBody).then
	(
		function(response)
		{
			console.log(response.result);
			UpdateSheetList(callback);
		}, 
		
		function(reason) 
		{
			console.error('error: ' + reason.result.error.message);
		}
	);	
}

function GetSpreadsheetList(callback)
{
	console.log("Updating spreadsheet list...");
	
	gapi.client.drive.files.list({'pageSize': 100, 'fields': "nextPageToken, files(id, name)", 'q' : "fullText contains '" + TemplateCheckString + "'"}).then
	(
		function(response)
		{
			console.log(response.result.files);
			
			SpreadsheetList = response.result.files;
			
			if(callback != null)
			{
				callback();
			}
		}
	);
}

function ChooseExistingSpreadsheet(spreadsheetId)
{
	console.log("ChooseExistingSpreadsheet");
	console.log(spreadsheetId);
	
	SpreadsheetId = spreadsheetId;
	UpdateCategoryLists(UpdateSheetList);
	SaveSpreadsheetToFirebase();
}

/*************************************** CATEGORIES *********************************************/

function AddCategory(categoryName, categoryType, callback)
{	
	var coordinates;
	var categoryIndex

	for(i = 0; i < IncomeCategoryList.length; i++)
	{
		if(IncomeCategoryList[i] == categoryName)
		{
			alert("Category '" + categoryName + "' already exist! Please choose another category name.");
			return;
		}
	}
	
	for(i = 0; i < OutcomeCategoryList.length; i++)
	{
		if(OutcomeCategoryList[i] == categoryName)
		{
			alert("Category '" + categoryName + "' already exist! Please choose another category name.");
			return;
		}
	}
	
	coordinates = categoryType == "income" ? IncomeCategoriesPosition : OutcomeCategoriesPosition;

	// Search first free category slot
	gapi.client.sheets.spreadsheets.values.get( {spreadsheetId:SpreadsheetId, range:coordinates} ).then
	(
		function(response)
		{
		    categoryIndex = (response.result.values ? response.result.values.length : 0) + 1 + 1;
		  
		    if(categoryIndex > MaxCategoryIndex)
		    {
			    alert("No more " + categoryType + " categories can be added.");
				return;
		    }
		  
		    console.log("First free " + categoryType + " category slot found at: " + categoryIndex);
			
			coordinates = (categoryType == "income" ? IncomeCategoryColumn : OutcomeCategoryColumn) + categoryIndex;
			
		    UpdateSingleCategory(coordinates, categoryName, callback);
		},
		
		function(reason)
		{
			console.error('Error: ' + reason.result.error.message);
		}
	);
}

function DeleteCategory(categoryName, callback)
{
	var coordinates;
	indexFound = -1;
	
	console.log(categoryName);
	
	for(i = 0; i < IncomeCategoryList.length; i++)
	{
		if(IncomeCategoryList[i] == categoryName)
		{
			coordinates = IncomeCategoryColumn + (i + 2);
			indexFound = i;
			break;
		}
	}
	
	for(i = 0; i < OutcomeCategoryList.length; i++)
	{
		if(OutcomeCategoryList[i] == categoryName)
		{
			coordinates = OutcomeCategoryColumn + (i + 2);
			indexFound = i;
			break;
		}
	}
	
	if(indexFound == -1)
	{
		alert("Category to delete not found!");
		return;
	}
	
	if(indexFound == 0)
	{
		alert("Unable to delete default category!");
		return;
	}
	
	UpdateSingleCategory(coordinates, "", callback);
}

function UpdateCategoryLists(callback)
{
	console.log("Updating categories..");
	
	gapi.client.sheets.spreadsheets.values.get( {spreadsheetId:SpreadsheetId, range:IncomeCategoriesPosition} ).then
	(
		function(response)
		{
			IncomeCategoryList = response.result.values;
			console.log("Income categories updated: " + IncomeCategoryList);
			
			gapi.client.sheets.spreadsheets.values.get( {spreadsheetId:SpreadsheetId, range:OutcomeCategoriesPosition} ).then
			(
				function(response)
				{
					OutcomeCategoryList = response.result.values;
					console.log("Outcome categories updated: " + OutcomeCategoryList);
					
					generateBasicDropDown();
					generateMonths();
					if(callback != null)
					{
						callback();
					}
				},
				
				function(reason)
				{
					console.error(reason);
				}
			);
		},
		
		function(reason)
		{
			console.error(reason);
		}
	);
}

function UpdateSingleCategory(coordinate, value, callback)
{
	var body = {"range":coordinate, "majorDimension":"ROWS", "values":[[value]]};
		
	gapi.client.sheets.spreadsheets.values.update( {spreadsheetId:SpreadsheetId, range:coordinate, valueInputOption:'USER_ENTERED'}, body).then
	(
		function(response)
		{
			console.log(response.result);
			
			UpdateCategoryLists(callback);
		}, 
		  
		function(reason)
		{
			console.error('Error: ' + reason.result.error.message);
		}
	);
}


/************************************** EXPENSE LIST ********************************************/

function UpdateExpenseList(month, callback)
{
	gapi.client.sheets.spreadsheets.values.get( {spreadsheetId:SpreadsheetId, range:month + "!" + ExpenseListPosition} ).then
	(
		function(response)
		{
			ExpenseList = response.result.values;
			
			console.log("Expense list updated");
			
			if(ExpenseList == null)
				return;
			
			for(i = 0; i < ExpenseList.length; i++)
			{
				console.log(ExpenseList[i]);
			}
			
			if(callback != null)
			{
				callback();
			}
		},
		
		function(reason)
		{
			console.error('Error: ' + reason.result.error.message);
		}
	);
}

/************************************** SUMMARY ********************************************/
function UpdateSummary(month, callback)
{
	console.log("Updating summarry...");
	
	// Get total summary
	gapi.client.sheets.spreadsheets.values.get( {spreadsheetId:SpreadsheetId, range:month + "!" + SummaryPosition} ).then
	(
		function(response)
		{
			SummaryList = response.result.values;
			console.log(SummaryList);
			
			gapi.client.sheets.spreadsheets.values.get( {spreadsheetId:SpreadsheetId, range:month + "!" + OutcomeCatSummaryPosition} ).then
			(
				function(response)
				{
					OutcomeSummary = response.result.values;
					
					for(i = 0; i < OutcomeSummary.length; i++)
					{
						if(OutcomeSummary[i][0] == "")
						{
							OutcomeSummary = OutcomeSummary.slice(0,i);
							console.log(OutcomeSummary);	
							break;							
						}
					}

					console.log(OutcomeSummary);
					
					gapi.client.sheets.spreadsheets.values.get( {spreadsheetId:SpreadsheetId, range:month + "!" + IncomeCatSummaryPosition} ).then
					(
						function(response)
						{
							IncomeSummary = response.result.values;
					
							for(i = 0; i < IncomeSummary.length; i++)
							{
								if(IncomeSummary[i][0] == "")
								{
									IncomeSummary = IncomeSummary.slice(0,i);
									console.log(IncomeSummary);	
									break;							
								}
							}

							console.log(IncomeSummary);
							
							
							if(callback != null)
							{
								callback();
							}
						}, 
						  
						function(reason)
						{
							console.error('Error: ' + reason.result.error.message);
						}
					);
				}, 
				function(reason)
				{
					console.error('Error: ' + reason.result.error.message);
				}
			);
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
		  
		  OnWebpageLoad();
		}
	);
}

function updateSigninStatus(isSignedIn) // Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
{
	if(isSignedIn)
	{
		OnWebpageLoad();
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
	generateDropDown();
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



