var IncomeCats =["wypłata", "stypendium", "bagiety"];
var OutcomeCats = ["czesne", "mieszkanie", "media", "meh"];
//var History = [["data1","kategoria1", "nazwa", 123], ["data2","kategoria2", "nazwa2", 456], ["data3","kategoria3", "nazwa3", 789]];
//var IncomeSummary = [["in1", 123], ["in2",345], ["in3",543]];
//var OutcomeSummary = [["out1", 12], ["out2",3], ["ou3",324]];
var FilesList = [["file1", 12325],["file2","23rre"],["file3","123ff34f"],["file4",13454]];
var ActualSheetId = "34tgrdb";
var Balance = -1230.01;
var Outcome = 123;
var Income = 123.423;

var Cats =[{"category":"Undefined", "type":-1},{"category":"Testing", "type":1},{"category":"Test", "type":-1},{"category":"3 linia", "type":1}];
//var Wydatki = JSON.parseText('');

var json = {
	"chart": {
		"type": "pie",
		"data": []
	}
};
var chart;
 
	function logout(){
	//	todo : akcja wylogowania z apluikacji
		alert("logout button clicked");
	}

	function genAll(){
		generateBasicDropDown();
		generateBasicPie();
		generateMonths();
		defCurrentFile();
		setMainBalance();
		UpdateSummary(CurrentSheetName,UpSummary);
		UpdateExpenseList(CurrentSheetName,printHistory);
	}
	
	function UpSummary(){
		getSummary();
		basicSummary();
	}
	
	function repleaceComma(input){
		var tmpStr = input.replace(',','.');
		return tmpStr;
	}
	
	function toNumber(inStr){
		inStr = repleaceComma(inStr);
		inStr = parseFloat(inStr);
		if(isNaN(inStr)){
			alert("Error, value in Amount of effort must be a number");
			return false;
		}
		else{
			return inStr;
		}
		
	}
  
	function getNewEffort(){
		//	pobranie z frontu danych
		var tmp = document.getElementById("Amount").value;
		var nazwa = document.getElementById("Title").value;
		var kategoria = document.getElementById("Category").value;
		// zamiana przecinka na kropke
		tmp = toNumber(tmp);
		if(tmp != false) AddExpense(tmp, nazwa, kategoria);
		// to do wysłanie danych
		
	}

	function generateDropDown(){
		console.log("Front function : generate all");
		// get income and outcoe cats
		OutcomeCats = GetLocalOutcomeCategories();
		IncomeCats = GetLocalIncomeCategories();
		
		// delete current categories
		$("#Category").children().remove();
		// add retrieved categories
		for(var iter=0; iter<IncomeCats.length; iter++){
				$('<option id="' + IncomeCats[iter] + '" value="' + IncomeCats[iter] + '">' + IncomeCats[iter] + '</option>').appendTo('#Category');
		}
		for(var iter=0; iter<OutcomeCats.length; iter++){
			$('<option id="' + OutcomeCats[iter] + '" value="' + OutcomeCats[iter] + '">' + OutcomeCats[iter] + '</option>').appendTo('#Category');
		}
		// redirect to page which add new effort
		window.location = "#pageone";

	}
  
    function generateBasicDropDown(){
		// to do: funckcja pobierania z GS ilości kategorii
		$("#Category").children().remove();
		console.log("Dredowe Front function : generate all");
		OutcomeCats = GetLocalOutcomeCategories();
		IncomeCats = GetLocalIncomeCategories();
		for(var iter=0; iter<IncomeCats.length; iter++){
				$('<option id="' + IncomeCats[iter] + '" value="' + IncomeCats[iter] + '">' + IncomeCats[iter] + '</option>').appendTo('#Category');
		}
		for(var iter=0; iter<OutcomeCats.length; iter++){
			$('<option id="' + OutcomeCats[iter] + '" value="' + OutcomeCats[iter] + '">' + OutcomeCats[iter] + '</option>').appendTo('#Category');
		}

	}
	
	function generateMonths(){
		// to do: funckcja pobierania z GS ilości kategorii
		$("#MonthsSummary").children().remove();
		var tmp = GetLocalMonthList();
		console.log("Front function : generate months");
		for(var iter=0; iter<tmp.length; iter++){
				$('<option value="'+tmp[iter]+'" onclick=getSelectedMonth()>' + tmp[iter] + '</option>').appendTo('#MonthsSummary');
		}
		defCurrentFile();
		setMainBalance();
	}
	
	function getSelectedMonth(){
		console.log("wybrano jakis miesiac");
		var tmp = document.getElementById("MonthsSummary").value
		UpdateSummary(tmp,genAll);
	}
  
  
    function getSummary(){
	  
		Income = GetLocalSummaryIncome();
		Outcome = GetLocalSummaryOutcome();
		Balance = GetLocalSummaryBalance();
		
		printPie();
		
		var table = document.getElementById("testTable");

		var tableCnt = $('#testTable tr').length;

		// delete all inside rows
		for(var i=1; i<tableCnt; i++){
			table.deleteRow(1);			
		}

		// print all income
		for (var ite=0; ite<IncomeSummary.length; ite++){
			// Create an empty <tr> element and add it to the 1st position of the table:
			var row = table.insertRow(1);
			// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			// Add some text to the new cells:
			cell1.innerHTML = IncomeSummary[ite][0];
			cell2.innerHTML = IncomeSummary[ite][1];
		}

		// print all outcome
		for (var ite=0; ite<OutcomeSummary.length; ite++){
			// Create an empty <tr> element and add it to the 1st position of the table:
			var row = table.insertRow(1);
			// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			// Add some text to the new cells:
			cell1.innerHTML = OutcomeSummary[ite][0];
			cell2.innerHTML = "-" + OutcomeSummary[ite][1];
		}
		
		// set balance 
		table.deleteTFoot();
			
		basicSummary();
		// redirect to page which add new effort
		window.location = "#Summary";
	} 
  
    function basicSummary(){
	  
		var table = document.getElementById("MainSummary");

		var tableCnt = $('#MainSummary tr').length;

		// delete all inside rows
		for(var i=1; i<tableCnt; i++){
			table.deleteRow(1);			
		}

		// print basic summary
		var IncomeRow = table.insertRow(1);
		// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
		var IncomeName = IncomeRow.insertCell(0);
		var IncomeVal = IncomeRow.insertCell(1);
		// Add some text to the new cells:
		IncomeName.innerHTML = "Income";
		IncomeVal.innerHTML = Income;
		
		var OutcomeRow = table.insertRow(1);
		// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
		var OutcomeName = OutcomeRow.insertCell(0);
		var OutcomeVal = OutcomeRow.insertCell(1);
		// Add some text to the new cells:
		OutcomeName.innerHTML = "Outcome";
		OutcomeVal.innerHTML = "- " + Outcome;
		
		// set balance 
		table.deleteTFoot();
		// Create an empty <tfoot> element and add it to the table:
		var footer = table.createTFoot();

		// Create an empty <tr> element and add it to the first position of <tfoot>:
		var row = footer.insertRow(0);      

		// Insert a new cell (<td>) at the first position of the "new" <tr> element:
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var test = new Date().getTime().toString();
		// Add some bold text in the new cell:
		cell1.innerHTML = "<b>Balance</b>";
		cell2.innerHTML = "<b>" +Balance+  "</b>";	
	
  } 

	function printHistory(){
		
		
		$("#MonthsSummaryHistory").children().remove();
		var tmp = GetLocalMonthList();
		console.log("Front function : generate months");
		for(var iter=0; iter<tmp.length; iter++){
				$('<option value="'+tmp[iter]+'" onclick=getSelectedMonth()>' + tmp[iter] + '</option>').appendTo('#MonthsSummaryHistory');
		}

		var table = document.getElementById("historyTable");

		var tableCnt = $('#historyTable tr').length;

		// delete all inside rows
		for(var i=1; i<tableCnt; i++){
			table.deleteRow(1);			
		}
			
		// print new inside rows
		for (var iter=0; iter<ExpenseList.length; iter++) {
			// Create an empty <tr> element and add it to the 1st position of the table:
			var row = table.insertRow(1);
			// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			var CatName = row.insertCell(0);
			var Title = row.insertCell(1);
			var Amount = row.insertCell(2);
			var Dejt = row.insertCell(3);
			// Add some text to the new cells:
			CatName.innerHTML = ExpenseList[iter][3];
			Title.innerHTML = ExpenseList[iter][2];
			Amount.innerHTML = ExpenseList[iter][1];
			Dejt.innerHTML = ExpenseList[iter][0];
		}
		
		//generateMonthsHist();
		// redirect to page which add new effort
		window.location = "#History";
	
	}
	
	function getSelectedMonthHistory(){
		console.log("wybrano jakis miesiac");
		var tmp = document.getElementById("MonthsSummaryHistory").value
		UpdateExpenseList(tmp,printHistory);
	}
	
	function generateMonthsHist(){

	}
  
	function sendBalance(){
		//	pobranie z frontu danych
		var tmp = document.getElementById("balance").value;
		// zamiana przecinka na kropke
		tmp = repleaceComma(tmp);
		//	sprawdzenie czy wpisana zmienna do pola amount jest liczbą
		wydatek = parseFloat(tmp);
		if(isNaN(wydatek)){
			alert("Error, value in Amount of effort must be a number");
		}
		else{
			alert("nowy balans: " + wydatek );
		}
		// to do wysłanie danych
	}
  
	function manageCategories(){

		var table = document.getElementById("Categories");
		var tableCnt = $('#Categories tr').length;
		
		// delete all inside rows
		for(var i=1; i<tableCnt; i++){
			table.deleteRow(1);			
		}
		
		// dodanie ostatniej linijki
		var helperChioce ="<select id=\"newCategoryType\"><option value=\"Income\">Income</option><option value=\"Effort\">Effort</option></select>";
		var helperButton = "<button onclick=SaveNewCategory()><img src=\"img/save.png\" /></button>";
		
		var newRow = table.insertRow(1);
		// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
		var Name = newRow.insertCell(0);
		var CatType = newRow.insertCell(1);
		var Bttn = newRow.insertCell(2);
		
		Name.innerHTML = "<input id=\"newCategoryName\"></input>";
		CatType.innerHTML = helperChioce;
		Bttn.innerHTML = helperButton;
		
		var tmpAllCats = IncomeCats;
			tmpAllCats = tmpAllCats  + OutcomeCats;
		// print all income categories rows
		for(var i=0; i<IncomeCats.length; i++){
			// Create an empty <tr> element and add it to the 1st position of the table:
			var CatRow = table.insertRow(1);
			// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			var Name = CatRow.insertCell(0);
			var CatType = CatRow.insertCell(1);
			var Bttn = CatRow.insertCell(2);
			// Add some text to the new cells:
			Name.innerHTML = IncomeCats[i];
			CatType.innerHTML = "Income";
			Bttn.innerHTML = "<button onclick=deleteCategory(1,"+i+")><img src=\"img/del.png\" /></button>";

		}
		// print all outcome categories rows
		for(var a=0; a<OutcomeCats.length; a++){
			// Create an empty <tr> element and add it to the 1st position of the table:
			var CatRow = table.insertRow(1);
			// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			var Name = CatRow.insertCell(0);
			var CatType = CatRow.insertCell(1);
			var Bttn = CatRow.insertCell(2);
			// Add some text to the new cells:
			Name.innerHTML = OutcomeCats[a];
			CatType.innerHTML = "Outcome";
			Bttn.innerHTML = "<button onclick=deleteCategory(-1,"+a+")><img src=\"img/del.png\" /></button>";

		}
		
		// redirect to page which add new effort
		window.location = "#Settings";
		
	}
	
	function deleteCategory(type, btn){
		if(type == 1){
			// usuniecie kategorii z dochodow
			IncomeCats.splice(btn, 1);
			// przeładowanie obecnych kategroii
			manageCategories();
		}
		else if(type == -1){
			// usuniecie kategorii z wydatkow 
			OutcomeCats.splice(btn, 1);
			// przeładowanie obecnych kategroii
			manageCategories();
		}
		else{
			alert("Unknown category type");
		}
	}

	function SaveNewCategory(){
		var CategotyName = document.getElementById("newCategoryName").value;
		var CategoryType = document.getElementById("newCategoryType").value;
		
		if(CategoryType == "Income"){IncomeCats.push(CategotyName);}
		else if(CategoryType == "Effort"){OutcomeCats.push(CategotyName);}
		else{alert("Unknown category type");}

		manageCategories();
	}
	
	function SaveNewAlarmLevel(){
		var AlarmLevel = document.getElementById("EffortsAlarn").value;
		
		AlarmLevel =toNumber(AlarmLevel);
		if(AlarmLevel!=false) alert("nowy poziom alarmu: " + AlarmLevel );
	}

	function generateBasicPie() {

		json = {
			"chart": {
				"type": "pie",
				"data": ["no data", 1]
			}
		};

		// create the chart
		chart =  anychart.fromJson(json);

		// display the chart in the container
		chart.container('PieGraph');
		// set legend position
		chart.legend().position("right");
		// set items layout
		chart.legend().itemsLayout("vertical");
		
		chart.draw();

	}
	
	function printPie() {

		deletePie();
	
		var tmp = [];
		for(iter in Cats){
			tmp.push([Cats[iter].category, Cats[iter].type]);
		}

		json = {
			"chart": {
				"type": "pie",
				"data": OutcomeSummary
			}
		};

		// create the chart
		chart =  anychart.fromJson(json);

		// display the chart in the container
		chart.container('PieGraph');
		// set legend position
		chart.legend().position("right");
		// set items layout
		chart.legend().itemsLayout("vertical");
		
		chart.draw();

	}
	
	function deletePie() {
		$("#PieGraph").children().remove();
	}
	
	function generateFileslist(){
		
		var table = document.getElementById("FilesList");
		var tableCnt = $('#FilesList tr').length;
		
		// delete all inside rows
		for(var i=1; i<tableCnt; i++){
			table.deleteRow(1);			
		}
		
		// dodanie ostatniej linijki
		var helperButton = "<button onclick=NewFile()><img src=\"img/save.png\" /></button>";
		
		var newRow = table.insertRow(1);
		// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
		var Name = newRow.insertCell(0);
		var Bttn = newRow.insertCell(1);
		
		Name.innerHTML = "<input id=\"newFileName\"></input>";
		Bttn.innerHTML = helperButton;
		
		// print all vailable files
		for(var i=0; i<FilesList.length; i++){
			// Create an empty <tr> element and add it to the 1st position of the table:
			var CatRow = table.insertRow(1);
			// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			var Name = CatRow.insertCell(0);
			var Bttn = CatRow.insertCell();
			// Add some text to the new cells:
			Name.innerHTML = FilesList[i][0];
			Bttn.innerHTML = "<button onclick=GotoSheet("+i+")><img src=\"img/arrowR.png\" /></button>";

		}
		
		// redirect to page which add new effort
		window.location = "#FilesManagement";
		
	}
	
	function NewFile(){
		var newFile = document.getElementById("newFileName").value;
		var tmp = [newFile, "234rf"];
		alert("nowy lik rob, nazwa nowego pliku: " + newFile);
		
		FilesList.push(tmp);
		generateFileslist();
		alert("lista plikow" + FilesList);
	}
	
	function GotoSheet(btn){
		alert("wcisnieto przywcisk: " + btn + "przejscie do shitu");
		ActualSheetId = FilesList[btn][0];
	}
	
	function defCurrentFile(){
		
	}
	
	function setMainBalance(){
		document.getElementById("mainBalance").innerHTML = "Balance: " + Balance;
	}
	
	function doLogin(){
		generateBasicDropDown();
		window.location = "#pageone";
	}
	
	function doLogout(){
		window.location = "#loginPage";
	}