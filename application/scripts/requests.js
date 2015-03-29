
function addLike(url) {
	console.log("from addlike: The url is " + url);
	var sendLink = new XMLHttpRequest();
	var likeRoute = "http://bingplus.cloudapp.net/like";
	sendLink.onreadystatechange = function() {
		if(sendLink.readystate == 4 && sendLink.status == 200) {

		}
	}
	sendLink.open("POST", likeRoute, "true");
	sendLink.send(JSON.stringify({"url": url}));
}

function commentWindow(url) {
	alert("You're trying to comment on this!");
}