window.onload = function (){
    var startButton;
var canvas;
var context;
var video;

function init() {
  startButton = document.getElementById('StartButton');
  canvas = document.getElementById('Canvas');
  context = canvas.getContext('2d');
  video = document.getElementById('SourceVideo');

  if (video.readyState >= 3) {
    readyToPlay();
  } else {
    video.addEventListener('canplay', readyToPlay);
  }
  
  startButton.addEventListener('click', function () {
    startCamera();
  });
}

function readyToPlay() {
  // Set the canvas the same width and height of the video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Play video
  video.play();
  drawFrame(video);
}

function initCamera(stream) {
  // deprecated  
  // video.src = window.URL.createObjectURL(stream);
  video.srcObject = stream;
}

function startCamera() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(initCamera)
      .catch(console.error);
  }
}

function drawFrame(video) {
  context.drawImage(video, 0, 0);
  
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  invertColors(imageData.data);
  context.putImageData(imageData, 0, 0);
  
  setTimeout(function () {
    drawFrame(video);
  }, 10);
}

function invertColors(data) {
  for (var i = 0; i < data.length; i+= 4) {
    data[i] = data[i] ^ 255;
    data[i+1] = data[i+1] ^ 255;
    data[i+2] = data[i+2] ^ 255;
  }
}

window.addEventListener('load', init);

// MediaDevices polyfill
(function() {

	var promisifiedOldGUM = function(constraints, successCallback, errorCallback) {

		// First get ahold of getUserMedia, if present
		var getUserMedia = (navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia);

		// Some browsers just don't implement it - return a rejected promise with an error
		// to keep a consistent interface
		if(!getUserMedia) {
			return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
		}

		// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
		return new Promise(function(successCallback, errorCallback) {
			getUserMedia.call(navigator, constraints, successCallback, errorCallback);
		});
		
	}

	// Older browsers might not implement mediaDevices at all, so we set an empty object first
	if(navigator.mediaDevices === undefined) {
		navigator.mediaDevices = {};
	}

	// Some browsers partially implement mediaDevices. We can't just assign an object
	// with getUserMedia as it would overwrite existing properties.
	// Here, we will just add the getUserMedia property if it's missing.
	if(navigator.mediaDevices.getUserMedia === undefined) {
		navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
	}
	
})();
}
