
//simple random selection of quotes 
window.onload = function() {
	var quote = "";
	var container = document.getElementById("quote");

	var select = Math.round(Math.random() * 2 + 1);
	switch(select) {
		case 1: quote = "\"We know what we are, but know not what we may be.\" - William Shakespeare";
			break;
		case 2: quote = "\"I can't change the direction of the wind, but I can adjust my sails to always reach my destination.\" - Jimmy Dean";
			break;
		case 3: quote = "\"Believe you can and you're halfway there.\" - Theodore Roosevelt";
			break;
		default: "Error";
	}

	container.innerHTML = quote;
}