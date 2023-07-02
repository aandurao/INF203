var currentSlide = -1;
var pause = false;
var slides;

function loadSlides() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "slides.json", true);
  xhttp.onload = function() {
	slides = JSON.parse(this.responseText).slides;
  };
  xhttp.send();
}

loadSlides();

function renderSlides() {
    currentSlide++;
    div = document.getElementById("TOP");
    div.innerHTML = '';
    var frame = document.createElement("iframe");
    frame.src = slides[currentSlide].url;
    div.appendChild(frame);
    if (currentSlide < slides.length && !pause) {
        setTimeout(renderSlides, 2000);
    }
}

function pauseOrContinue() {
	if(pause) {
		pause = false;
		renderSlides();
	} else {
		pause = true;
	}
}

function nextSlide() {
	pause = true;
	if(currentSlide < slides.length) {
		currentSlide++;
		div = document.getElementById("TOP");
		div.innerHTML = '';
		var frame = document.createElement("iframe");
		frame.src = slides[currentSlide].url;
		div.appendChild(frame);
	} else {
		return;
	}
}

function prevSlide() {
	pause = true;
	if(currentSlide > 0) {
		currentSlide--;
		div = document.getElementById("TOP");
		div.innerHTML = '';
		var frame = document.createElement("iframe");
		frame.src = slides[currentSlide].url;
		div.appendChild(frame);
	} else {
		return;
	}
}

document.getElementById("PLAY").addEventListener("click", function() {
  renderSlides();
});

document.getElementById("but_pause").addEventListener("click", function() {
  pauseOrContinue();
});

document.getElementById("suivant").addEventListener("click", function() {
  nextSlide();
});

document.getElementById("prev").addEventListener("click", function() {
  prevSlide();
});