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
		var incomeCats='[{"category":"QA","email":"a@b"},{"category":"PROD","email":"b@c"},{"category":"nie ma sil","email":"c@d"},{"category":"MAAAM","email":"c@d"}]';
		var NewCategories=JSON.parse(incomeCats);
		
		//add new categroy
		for(var cat in NewCategories){
			if(document.getElementById(NewCategories[cat].category)){
			}else{
				$('<option id="' + NewCategories[cat].category + '" value="' + NewCategories[cat].category + '">' + NewCategories[cat].category + '</option>').appendTo('#Category');
			}
		}

		// delete one of category
		var currentCats = document.getElementById('Category').length;
		var htmlObj = document.getElementById('Category');
		
		for(var i=1; i<=htmlObj.length;  i++){
			if(incomeCats.indexOf(htmlObj[i].value) != -1){
			}else{
				i--;
				var elem = document.getElementById(htmlObj[i].value);
				elem.parentNode.removeChild(elem);
			}
		}
	}
  
    function generateBasicDropDown(){
		// to do: funckcja pobierania z GS ilości kategorii
		// - Czy potrzeba wysyłać datę?
		var jsonDataForBrands='[{"category":"QA","email":"a@b"},{"category":"PROD","email":"b@c"},{"category":"DEV","email":"c@d"}]';
		var Categories=JSON.parse(jsonDataForBrands);

		for (var catName in Categories) {
			$('<option id="'+ Categories[catName].category +'" value="'+ Categories[catName].category+'">' + Categories[catName].category + '</option>').appendTo('#Category');
		
		}
	}
  
  function getSummary(){
	  alert("ok");
	//var jsonDataForBrands='[{"category":"dochod","value":"a@b"},{"category":"odchod","value":"b@c"},{"category":"gowno","value":"c@d"}]';
	
	var table = document.getElementsByText('summaryBody');
	alert(table);
		if(table.innerHTML  == "cell1_1"){
			alert("true");
		}
		else alert("false");
	var Categories=JSON.parse(jsonDataForBrands);
	for (var catName in Categories) {
		$('<div class="divTableRow"><div class="divTableCell">' + Categories[catName].category + '</div><div class="divTableCell">' + Categories[catName].value + '</div>	</div>').appendTo('#summaryBody');
    } 
	  
	  
//	<div class="divTableRow"><div class="divTableCell">' + cell1_2 + '</div><div class="divTableCell">' + cell2_2 + '</div>	</div>
  }