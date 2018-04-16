  var wydatek, nazwa, kategoria;
  
	function logout(){
	//	todo : akcja wylogowania z apluikacji
		alert("logout button clicked");
	}

	 function repleaceComma(input){
		var tmpStr = input.replace(',','.');
		return tmpStr;
	}

  
  function getData (){
	//	pobranie z frontu danych
	var tmp = document.getElementById("Amount").value;
	nazwa = document.getElementById("Title").value;
	kategoria = document.getElementById("Category").value;
	// zamiana przecinka na kropke
	tmp = repleaceComma(tmp);
	//	sprawdzenie czy wpisana zmienna do pola amount jest liczbą
	wydatek = parseFloat(tmp);
	if(isNaN(tmp)){
		alert("Error, value in Amount of effort must be a number");
	}
	else{
		return printData();
	}
	// to do wysłanie danych
	
  }
  

  function printData(){
	alert("wartosc wydatku: " + wydatek + ", nazwa: " + nazwa + ", kategoria: " + kategoria);
  }
  
  function generateDropDown(){
	// to do: funckcja pobierania z GS ilości kategorii
	// - Czy potrzeba wysyłać datę?
	var jsonDataForBrands='[{"category":"QA","email":"a@b"},{"category":"PROD","email":"b@c"},{"category":"DEV","email":"c@d"}]';
	var Categories=JSON.parse(jsonDataForBrands);
	for (var catName in Categories) {
		$('<option value="'+ Categories[catName].category+'">' + Categories[catName].category + '</option>').appendTo('#Category');
    } 
  }