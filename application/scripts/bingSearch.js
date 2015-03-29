function searchBing() {
	var searchBar = document.getElementById("searchBar");
	var searchQuery = searchBar.value;
	if(searchQuery == "") {
		return;
	}
	var searchRoute = "https://user:zYdO5g8rm3yqbGpS4pJXCUTU++qEPBcnm9BfXXeP5DQ@api.datamarket.azure.com/Bing/Search/v1/Web?Query=%27";
	searchRoute += searchQuery;
	searchRoute += "%27&$top=10&$format=JSON";

	var sender = new XMLHttpRequest();
	sender.onreadystatechange = function() {
		if(sender.readyState == 4 && sender.status == 200) {
			//we're good, the search worked
			var searchResults = JSON.parse(sender.responseText);
			console.log(searchResults);

			displayResults(searchResults);
		} 
	}
	sender.open("GET", searchRoute, "true");
	sender.send();

}

function displayResults(results) {
	//Modify UI (logo fades out) and search bar moves to top
	var siteList = results.d.results;
	var siteListContainer = document.createElement("div");
	siteListContainer.id = "siteListContainer";

	var cap = document.getElementById("cap");
	cap.insertBefore(siteListContainer, cap.childNodes[0]);

	for(var i = 0; i < siteList.length; i++) {
		var title = siteList[i].Title;
		var dURL = siteList[i].DisplayUrl;
		var desc = siteList[i].Description;

		var itemWrapper = document.createElement("div");
		itemWrapper.className = "linkwrapper";
		siteListContainer.appendChild(itemWrapper);

		var titleDisplay = document.createElement("h1");
		titleDisplay.className = "linktitle"
		var titleText = document.createTextNode(title);
		titleDisplay.appendChild(titleText);
		itemWrapper.appendChild(titleDisplay);


		var urlLink = document.createElement("a");
		urlLink.href = "http://" + dURL;
		urlLink.rel = "external";
		itemWrapper.appendChild(urlLink);

		var urlDisplay = document.createElement("h3");
		urlDisplay.className = "linkurl";
		var urlText = document.createTextNode(dURL);
		urlDisplay.appendChild(urlText);
		urlLink.appendChild(urlDisplay);

		var descDisplay = document.createElement("p");
		descDisplay.className = "linkdesc";
		var descText = document.createTextNode(desc);
		descDisplay.appendChild(descText);
		itemWrapper.appendChild(descDisplay);

		var likeButton = document.createElement("div");
		likeButton.className = "likeButton";
		var commentButton = document.createElement("div");
		commentButton.className = "commentButton";

		itemWrapper.appendChild(likeButton);
		itemWrapper.appendChild(commentButton);
	}
}