function showText() {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '../../Show');
    xhttp.onload = function () {
        if (this.status == 200) {
            document.getElementById("MAINSHOW").textContent = this.responseText;
        }
    }
    xhttp.send();
}

function showAdd() {
    document.getElementById("ADDFORM").style.visibility = "visible";
}

function doAdd() {
	
    document.getElementById("MAINSHOW").innerHTML = "";
	
    var title = document.getElementById("titleTF").value;
    var value = document.getElementById("valueTF").value;
    var color = document.getElementById("colorTF").value;

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '../../add?title='+title+'&value='+value+'&color='+color);
    xhttp.send();
}

function showRemove() {
    document.getElementById("REMFORM").style.visibility = "visible";
}

function doRemove() {
    document.getElementById("MAINSHOW").innerHTML = "";
	
    var index = document.getElementById("indexTF").value
	
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', '../../remove?index='+(new Number(index)).toString());
    xhttp.send();
}

function doClear() {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', "../../clear");
    xhttp.send();
}

function doRestore() {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', "../../restore");
    xhttp.send();
}