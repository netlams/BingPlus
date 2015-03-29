function resultformat() {
	$(document).ready(function(){
		var checkStatus = $('#quote').css( "display" );
		if (checkStatus == 'none') {
			// $("#quote").css('display', 'inherit');
			// $("#miniLogoContainer").css('display', 'none');
			// $("#logoContainer").toggle('400');
			; // do nothing for now
		}
		else {
			$("#logoContainer").toggle('400');
			$("#quote").css('display', 'none');
			$("#miniLogoContainer").css('display', 'inline-block');
			$("#logoContainer").css('float', 'left');
			// $("#searchContainer").css('min-width', '200px'); // tried make for mobile ver
			$("#searchBar").animate({width: '65%'}, 400);
		}
	});
}

function searchBing() {
	var searchBar = document.getElementById("searchBar");
	var searchQuery = searchBar.value;
	if(searchQuery == "") {
		alert("Hey you forgot to type a search term!");
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
			
			var siteList = searchResults.d.results;

			grabRatings(siteList, function(listData) {
				//console.log(listData);
				displayResults(siteList, listData);	
			});
		} 
	}
	sender.open("GET", searchRoute, "true");
	sender.send();
	resultformat();
}

function grabRatings(siteList, callback) {
	var ratingsRoute = "http://bingplus.cloudapp.net/info";
	var dataGrabber = new XMLHttpRequest();
	var urlList = [];
	//console.log("siteList: " + siteList);
	for(var k = 0; k < siteList.length; k++) {
		urlList[k] = siteList[k].Url;
	}
	//console.log("urlList: " + urlList);
	dataGrabber.onreadystatechange = function() {
		if(dataGrabber.readyState == 4 && dataGrabber.status == 200) {
			callback(JSON.parse(dataGrabber.responseText));
		}
	};
	dataGrabber.open("POST", ratingsRoute, "true");
	dataGrabber.send(JSON.stringify({"urlList": urlList}));
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
		if(resultData.exists) {
			if(resultData.likes[i] <= 5) {
				likeButtonIcon.src = "../assets/icons/tiny_heart_h_" + resultData.likes[i] + ".png";
			} else {
				likeButtonIcon.src = "../assets/icons/tiny_heart_h_5.png";
			}
		} else {
			likeButtonIcon.src = "../assets/icons/tiny_heart_h_1.png";
		}
		likeButton.className = "likeButton";
		likeButton.appendChild(likeButtonIcon);
		likeButton.onclick = function() {
			addLike(dURL);
		}
		var commentButton = document.createElement("div");
		var commentButtonIcon = document.createElement("img");
		//temporary file
		commentButtonIcon.src = "../assets/icons/tiny_heart_h_1.png";
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