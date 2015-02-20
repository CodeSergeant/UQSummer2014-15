
var client = mqtt("mqtt://winter.ceit.uq.edu.au");

function publishMQTT  () {
	var messageObject = {}
	messageObject.priority = document.getElementById("priority").value || null;
	messageObject.algorithm = document.getElementById("algorithm").value || null;
	messageObject.speaker = document.getElementById("speaker").value || null;
	messageObject.language = document.getElementById("language").value || null;
	messageObject.volume = document.getElementById("volume").value || null;
	messageObject.rate = document.getElementById("rate").value || null;
	messageObject.text = document.getElementById("message").value || null;

	client.publish("SpeakThis", JSON.stringify(messageObject));
};