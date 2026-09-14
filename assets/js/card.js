var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

// Per-page settings come from <body data-*> so index.html and en.html share this file
var cardImageSrc = document.body.dataset.cardImage;
var downloadName = document.body.dataset.downloadName || "greeting-card.png";

var cardFont = "35pt Satorp, sans-serif";
var textX = canvasWidth / 2;
var textY = canvasHeight - 300;
var textMaxWidth = canvasWidth - 160; // keep long names inside the card

var imageObj = new Image();
imageObj.onload = function () {
    context.drawImage(imageObj, 0, 0, canvasWidth, canvasHeight);
};
imageObj.onerror = function () {
    console.error("Failed to load card image: " + cardImageSrc);
};
imageObj.src = cardImageSrc;

function downloadCanvasAsImage() {
    canvas.toBlob(function (blob) {
        var url = URL.createObjectURL(blob);
        var downloadLink = document.createElement("a");
        downloadLink.setAttribute("download", downloadName);
        downloadLink.setAttribute("href", url);
        downloadLink.click();
        URL.revokeObjectURL(url);
    });
}

document.getElementById("downloadCard").addEventListener("click", function () {
    var nameInput = document.getElementById("name");
    var text = nameInput.value.trim();

    if (!text) {
        nameInput.focus();
        return;
    }

    // Make sure the Satorp font is loaded before drawing, so the
    // downloaded card never falls back to a default font
    document.fonts.load(cardFont).then(function () {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.drawImage(imageObj, 0, 0, canvasWidth, canvasHeight);

        context.font = cardFont;
        context.textAlign = "center";
        context.fillStyle = "white";
        // Soft shadow keeps the name readable over the patterned artwork
        context.shadowColor = "rgba(0, 0, 0, 0.45)";
        context.shadowBlur = 12;
        context.shadowOffsetY = 2;
        context.fillText(text, textX, textY, textMaxWidth);
        context.shadowColor = "transparent";
        context.shadowBlur = 0;
        context.shadowOffsetY = 0;

        nameInput.value = "";
        downloadCanvasAsImage();
    });
});
