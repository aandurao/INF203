function loadSlides() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "slides.json", true);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var slides = JSON.parse(this.responseText).slides;
      renderSlides(slides);
    }
  };
  xhttp.send();
}

function renderSlides(slides) {
  var topDiv = document.getElementById("TOP");
  for (var i = 0; i < slides.length; i++) {
    var slide = slides[i];
    setTimeout(function(slide) {
      topDiv.innerHTML = "";
      if (slide.url !== "") {
        var iframe = document.createElement("iframe");
        iframe.src = slide.url;
        topDiv.appendChild(iframe);
      }
    }, slide.time * 1000, slide);
  }
}

document.getElementById("PLAY").addEventListener("click", function() {
  loadSlides();
});