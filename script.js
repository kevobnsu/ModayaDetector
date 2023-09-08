/*Hey! I'm Manindra. I added some comments to the code using chatGPT for the ease of identifying the codes. Enjoy & try to build new things :) */

var count = 0;

function play() {
  var thissound = document.getElementById("sound");
  thissound.play();
}


// Wait for the page to be ready
window.addEventListener("load", function (e) {

  console.log("Page loaded!");

  // Store the color we will be tracking (selectable by clicking on the webcam feed)
  var color = { r: 255, g: 0, b: 0 };

  // Grab reference to the tags we will be using
  var slider = document.getElementById("tolerance");
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var webcam = document.getElementById('webcam');
  var swatch = document.getElementById("color");




  // Register our custom color tracking function
  tracking.ColorTracker.registerColor('dynamic', function (r, g, b) {
    return getColorDistance(color, { r: r, g: g, b: b }) < slider.value
  });

  // Create the color tracking object
  var tracker = new tracking.ColorTracker("dynamic");

  // Add callback for the "track" event
  tracker.on('track', function (e) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (e.data.length !== 0) {

      e.data.forEach(function (rect) {
        if ((rect.width > 20) && (rect.height > 20)) {
          count++;
          drawRect(rect, context, color);
        }
      });

    } else {
      count = 0;
    }

    if (count > 10) {
      play();
    }

  });

  // Start tracking
  tracking.track(webcam, tracker, { camera: true });

  // Add listener for the click event on the video
  webcam.addEventListener("click", function (e) {

    // Grab color from the video feed where the click occured
    var c = getColorAt(webcam, e.offsetX, e.offsetY);

    // Update target color
    color.r = c.r;
    color.g = c.g;
    color.b = c.b;

    // Update the div's background so we can see which color was selected
    swatch.style.backgroundColor = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";

  });

});

// Calculates the Euclidian distance between the target color and the actual color
function getColorDistance(target, actual) {
  return Math.sqrt(
    (target.r - actual.r) * (target.r - actual.r) +
    (target.g - actual.g) * (target.g - actual.g) +
    (target.b - actual.b) * (target.b - actual.b)
  );
}

// Returns the color at the specified x/y location in the webcam video feed
function getColorAt(webcam, x, y) {

  // To be able to access pixel data from the webcam feed, we must first draw the current frame in
  // a temporary canvas.
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = webcam.width;
  canvas.height = webcam.height;
  context.drawImage(webcam, 0, 0, webcam.width, webcam.height);

  // Then we grab the pixel information from the temp canvas and return it as an object
  var pixel = context.getImageData(x, y, 1, 1).data;
  return { r: pixel[0], g: pixel[1], b: pixel[2] };

}

// Draw a colored rectangle on the canvas
function drawRect(rect, context, color) {
  //context.strokeStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
  context.strokeStyle = "rgb(" + 255 + ", " + 0 + ", " + 0 + ")";
  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
}
