function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "text.txt");
  xhttp.onload = function() {
	  document.getElementById("ta").value = this.responseText;
  };
  xhttp.send();
}

function loadDoc2() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "text.txt");
  xhttp.onload = function() {
	  var lines = this.responseText.split('\n');
	  var colors = ['red', 'green', 'blue', 'orange', 'purple', 'brown', 'black'];
	  var line = '';
	  var div = document.getElementById("ta2");
	  for (var i = 0; i < lines.length; i++) {
		var elt = document.createElement("p");
		elt.textContent = lines[i];
		elt.style.color = colors[i % colors.length];
		div.appendChild(elt);
	  }
  };
  xhttp.send();
}