let video;
let handPose;
let hands = [];
let painting;
let px = 0;
let py = 0;

function setup() {
  createCanvas(640, 480);
  painting = createGraphics(640, 480);
  painting.clear();

  video = createCapture({
    video: {
      width: 320,
      height: 240
    }
  });
  video.hide();

  handPose = ml5.handpose(video, () => {
    console.log('Model ready');
  });
  handPose.on("predict", gotHands);
}

function gotHands(results) {
  hands = results;
}

function draw() {
  image(video, 0, 0);

  if (hands.length > 0) {
    let predictions = hands[0].landmarks;
    let index = predictions[8]; // index_finger_tip
    let thumb = predictions[4]; // thumb_tip

    let x = (index[0] + thumb[0]) / 2;
    let y = (index[1] + thumb[1]) / 2;

    let d = dist(index[0], index[1], thumb[0], thumb[1]);
    if (d < 20 && dist(px, py, x, y) > 2) {
      painting.stroke(255, 255, 0);
      painting.strokeWeight(8);
      painting.line(px, py, x, y);
    }

    px = x;
    py = y;
  }

  image(painting, 0, 0);
}