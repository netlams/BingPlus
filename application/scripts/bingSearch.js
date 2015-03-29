function searchBing() {
	var searchBar = document.getElementById("searchBar");
	var searchQuery = searchBar.value;

	var searchRoute = "https://user:zYdO5g8rm3yqbGpS4pJXCUTU++qEPBcnm9BfXXeP5DQ@api.datamarket.azure.com/Bing/Search/v1/Web?Query=%27";
	searchRoute += searchQuery;
	searchRoute += "%27&$top=10&$format=JSON";

	var sender = new XMLHttpRequest();
	sender.onreadystatechange = function() {
		if(sender.readyState == 4 && sender.status == 200) {
			//we're good, the search worked
			var searchResults = JSON.parse(sender.responseText);
			console.log(searchResults);
		} 
	}
	sender.open("GET", searchRoute, "true");
	sender.send();

}