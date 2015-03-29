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
			//console.log(searchResults);
			var siteList = searchResults.d.results;
			grabRatings(siteList, function(listData) {
				displayResults(siteList, listData);	
			});
		} 
	}
	sender.open("GET", searchRoute, "true");
	sender.send();

}

function grabRatings(siteList, callback) {
	var ratingsRoute = "";
	var dataGrabber = new XMLHttpRequest();
	dataGrabber.onreadystatechange(function() {
		if(dataGrabber.readyState == 4 && dataGrabber.status = 200) {
			callback(JSON.parse(dataGrabber.responseText));
		}
	});
	dataGrabber.open("GET", ratingsRoute, "true");
	dataGrabber.send();
}

function displayResults(results, resultData) {
	//Modify UI (logo fades out) and search bar moves to top

	var siteList = results;
	if(resultData.exists) {
		newLists = orderList(results, resultData);
		siteList = newLists[0];
		resultData = newLists[1];
	}

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
		var likeButtonIcon = document.createElement("img");
		if(resultData.likes[i] <= 5) {
			likeButtonIcon.src = "../assets/icons/tiny_heart_h_" + resultData.likes[i] + ".png";
		} else {
			likeButtonIcon.src = "../assets/icons/tiny_heart_h_5.png";
		}
		likeButton.className = "likeButton";
		likeButton.appendChild(likeButtonIcon);
		likeButton.onclick = function() {
			addLike(dURL);
		}
		var commentButton = document.createElement("div");
		var commentButtonIcon = document.createElement("img");
		//temporary file
		commentButtonIcon.src = "../assets/icons/tiny_heart_h_5.png";
		commentButton.className = "commentButton";
		commentButton.appendChild(commentButtonIcon);
		commentButton.onclick = function() {
			commentWindow(dURL, resultData.comments[i]);
		}

		itemWrapper.appendChild(likeButton);
		itemWrapper.appendChild(commentButton);
	}
}

function orderList(theList, theData) {
	var max = 0; var idx = 0;
	var newList = []; var newData = [];
	for(var i = 0; i < theList.length; i++) {
		for(var j = i; j < theList.length; j++) {
			if(theData.likes[j] >= max) {
				max = theData.likes[j];
				idx = j;
			}
		}
		max = 0;
		newList[i] = theList[idx];
		newData.likes[i] = theData.likes[idx];
		newData.comments[i] = theData.comments[idx];
	}
	return [newList, newData];
}