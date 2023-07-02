const textEdit = document.getElementById("textedit");
const sendButton = document.getElementById("sendbut");

function reloadChat() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "chatlog.txt");
	xhttp.onload = function() {
		console.log(this.responseText);
		var lastLines = this.responseText.split('\n').reverse().slice(-10);
		var chatContent = document.getElementById("ta");
		chatContent.innerHTML = "";
		for (var i = 0; i < lastLines.length; i++) {
			var elt = document.createElement("p");
			elt.textContent = lastLines[i];
			chatContent.appendChild(elt);
		}
	};
	xhttp.send();
	setTimeout(reloadChat, 1000);
}

function onSubmit() {
	
    var xhttp = new XMLHttpRequest();
    var message = document.getElementById("textedit").value;
    if (message == "") return;
    req = "chat.php?phrase=" + message;
    xhttp.open("GET", req);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                console.log("Success")
            } else {
                console.log("Error")
            }
        }
    };
    xhttp.send();
    document.getElementById("textedit").value = "";
}

document.getElementById("sendbut").addEventListener("click", onSubmit);

reloadChat();