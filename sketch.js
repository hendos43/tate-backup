// const AudioEnergy = require('./AudioEnergy.js');


// Master volume in decibels
const volume = -12;
console.log("script started");

let analyser;
let mic;

let playing = true;

let shapes = [];

// Create a new canvas to the browser size
async function setup() {
  createCanvas(windowWidth, windowHeight);
  shapes = [3, 6, 10, 9, 3];

  // Clear with black on setup
  background(0);

  // Make the volume quieter

  if (mic) {
    // stop recording
    mic.dispose();
    // Clear mic so we can create another on next click
    mic = null;
  } else {
    // Create a new mic
    mic = new Tone.UserMedia();

    // open it asks for user permission
    await mic.open();

    console.log("Opened Microphone:", mic.label);
    // Create an analyser node that makes a waveform
    analyser = new AudioEnergy();

    // Connect with analyser as well so we can detect waveform
    mic.connect(analyser);
    mic.connect(Tone.Master);
  }

  setInterval(addShape, 500);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Render loop that draws shapes with p5
function draw() {
  // Ensure everything is loaded first
  if (!mic || !analyser) return;
  console.log("I'm Drawing");

  const dim = Math.min(width, height);

  // Black background
  background(0);

  strokeWeight(dim * 0.0175);
  stroke(255);
  noFill();

  // Update the analyser
  analyser.update();

  // Draw FFT values
  strokeWeight(dim * 0.0025);
  stroke(255);
  noFill();

  if (playing) {
    console.log("i'm playing");
    const diameter = dim * 0.4;

    const kick = analyser.getEnergy("bass");

    const scale = map(kick, -50, -30, 0, 0.7);

    const treble = analyser.getEnergy("treble");

    const highMids = analyser.getEnergy("highMid");

    const lowMids = analyser.getEnergy("lowMid");

    //console.log(kick);
    const shapeFillR = map(treble, -100, -30, 0, 255);
    const shapeFillG = map(highMids, -100, -30, 0, 255);
    const shapeFillB = map(lowMids, -100, -30, 0, 255);
    fill(shapeFillR, shapeFillG, shapeFillB);

    const finalDiameter = diameter + scale * diameter;
    rectMode(CENTER);

    for (let i = 0; i < shapes.length; i++) {
      const bauhausShape = shapes[i];
      console.log(i);
      if (shapes.length > 50) {
        shapes.shift();
      }

      rect(
        bauhausShape.startX,
        bauhausShape.startY,
        finalDiameter,
        finalDiameter
      );
      bauhausShape.startX += bauhausShape.directionX;
      bauhausShape.startY += bauhausShape.directionY;
    }
  }
}

function addShape() {
  const sx = random(0, width + 700);
  let sy = 0;

  if (sx > width) {
    sy = random(0, height + 700);
  } else {
    sy = random(height, height + 700);
  }
  const shapeData = {
    startX: sx,
    startY: sy,
    directionX: random(0, -1),
    directionY: random(0, -1)
    // scaleF: random(0, 200),
    // fill: fillColour
  };
  shapes.push(shapeData);
}
