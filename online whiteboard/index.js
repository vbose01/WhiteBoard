
//all variables
var pdfName = "";

var canvas = $("#board")[0]; //jQuery special [0]
var ctx = canvas.getContext("2d");

var size;
var brushColor = "#000000";

var isPressed = false;
var isPaint = false;

var currArr = [];
var redoArr = [];
var uIndex = -1, rIndex = -1;


//clear WhiteBoard
$(".dustbin")[0].addEventListener("click", function() {
  brushSelected = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currArr = [];
  redoArr = [];
  uIndex = -1;
  rIndex = -1;
});


//mouse cursor
$(".cursor")[0].addEventListener("click", function() {
  brushSelected = false;
});


//eraser
$(".eraser")[0].addEventListener("click", function() {
  brushSelected = true;
  ctx.globalCompositeOperation = "destination-out";
});


//brush
$(".brush")[0].addEventListener("click", function() {
  brushSelected = true;
  ctx.globalCompositeOperation = "source-over";
});


//paint canvas
$(".paint")[0].addEventListener("click", function() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = brushColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});


//download button and name of pdf
window.jsPDF = window.jspdf.jsPDF;  //must add, not working otherwise!


$(".name")[0].addEventListener("change", function(event) {
  pdfName = event.target.value;
});

$(".download")[0].addEventListener("click", function() {
  var imgData = canvas.toDataURL("image/png");
  var doc = new jsPDF("p", "mm", "A4");
  doc.addImage(imgData, "PNG", 10, 10);
  doc.save(pdfName + ".pdf");
});




//mouse controls
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mousemove", draw);


//touch controls
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchend", stopDraw);
canvas.addEventListener("touchmove", draw);


//change color from input
$(".palette")[0].addEventListener("change", function(event) {
  brushColor = event.target.value;
});



//Brush size
size = 5;
$(".brush-size").text(size - 4);

$(".plus")[0].addEventListener("click", function() {
  size++;
  if (size >= 24) {
    size = 24;
  }
  $(".brush-size").text(size - 4);
});

$(".minus")[0].addEventListener("click", function() {
  size--;
  if (size <= 5) {
    size = 5;
  }
  $(".brush-size").text(size - 4);
});


//drawing Functions
function startDraw(event) {
  isPressed = true;
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
  event.preventDefault();
  redoArr = [];
  rIndex = -1;
}

function draw(event) {
  if(isPressed && brushSelected) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }
  event.preventDefault();
}

function stopDraw(event) {
  if(isPressed) {
    ctx.stroke();
    ctx.closePath();
    isPressed = false;
  }
  event.preventDefault();

  currArr.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  uIndex++;
}


//undo & redo
$(".undo")[0].addEventListener("click", function() {
  if(uIndex>=0) {
    redoArr.push(currArr[uIndex]);
    rIndex++;

    currArr.pop();
    uIndex--;
    ctx.putImageData(currArr[uIndex] ,0, 0);
  }
});

$(".redo")[0].addEventListener("click", function() {
  if(rIndex>=0) {
    currArr.push(redoArr[rIndex]);
    uIndex++;

    ctx.putImageData(redoArr[rIndex] ,0, 0);
    redoArr.pop();
    rIndex--;
  }
});
