// Hand Pose Painting with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let painting;
let px = 0;
let py = 0;

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
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    let firsthand = hands[0];

    if (hands.length > 1) {
      let secondHand = hands[1];

      let secondIndex = secondHand.index_finger_tip;
      let secondThumb = secondHand.thumb_tip;

      let x2 = (secondIndex.x + secondThumb.x) * 0.5;
      let y2 = (secondIndex.y + secondThumb.y) * 0.5

      let d2 = dist(secondIndex.x, secondIndex.y, secondThumb.x, secondThumb.y);
      if (d2 < 20) {
        painting.stroke(255, 0, 0);
        painting.strokeWeight(8);
        painting.line(px2, py2, x2, y2);
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
      painting.stroke(255, 255, 0);
      painting.strokeWeight(8);
      painting.line(px1, py1, x1, y1);
    }
    

    // Update previous position
    px1 = x1;
    py1 = y1;
  }

  // Overlay painting on top of the video
  image(painting, 0, 0);
}
