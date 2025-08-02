// Hand Pose Painting with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let painting;
let px = 0;
let py = 0;
let currentColor = [255, 255, 0]; // Default yellow
let brushSize = 4;


function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);

  // Create an off-screen graphics buffer for painting
  painting = createGraphics(640, 480);
  painting.clear();

  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // Setup color selection
  setupColorSelection();

}


function setupColorSelection() {
  const colorOptions = document.querySelectorAll('.color-option');
  
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      colorOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to clicked option
      this.classList.add('active');
      
      // Update current color
      const colorData = this.dataset.color.split(',');
      currentColor = [
        parseInt(colorData[0]), 
        parseInt(colorData[1]), 
        parseInt(colorData[2])
      ];
    });
  });
}

function clearCanvas() {
  painting.clear();
}

function downloadPainting() {
  // Create a temporary canvas with white background
  let tempCanvas = createGraphics(640, 480);
  tempCanvas.background(255); // White background
  tempCanvas.image(painting, 0, 0);
  
  // Save the painting
  save(tempCanvas, 'hand-drawing.png');
}


function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    let firsthand = hands[0];

    //second hand for brush size control
    if (hands.length > 1) {
      let secondHand = hands[1];

      let secondIndex = secondHand.index_finger_tip;
      let secondThumb = secondHand.thumb_tip;

      let x2 = (secondIndex.x + secondThumb.x) * 0.5;
      let y2 = (secondIndex.y + secondThumb.y) * 0.5;

      let d2 = dist(secondIndex.x, secondIndex.y, secondThumb.x, secondThumb.y);
      if (d2 < 20) {
        brushSize = 4;
      }
      else {
        brushSize = 4 + d2 * 0.5;
      }
      px2 = x2;
      py2 = y2;
    }
    
    let firstIndex = firsthand.index_finger_tip;
    let firstThumb = firsthand.thumb_tip;

    

    // Compute midpoint between index finger and thumb
    let x1 = (firstIndex.x + firstThumb.x) * 0.5;
    let y1 = (firstIndex.y + firstThumb.y) * 0.5;


    // Draw only if fingers are close together
    let d1 = dist(firstIndex.x, firstIndex.y, firstThumb.x, firstThumb.y);
    if (d1 < 20) {
      painting.stroke(currentColor[0], currentColor[1], currentColor[2]);
      painting.strokeWeight(brushSize);
      painting.line(px1, py1, x1, y1);
    }
    

    // Update previous position
    px1 = x1;
    py1 = y1;
  }

  // Overlay painting on top of the video
  image(painting, 0, 0);
}
