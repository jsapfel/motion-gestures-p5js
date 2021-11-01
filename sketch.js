// General
let permission = false;
let shakeCount = 0;
let circleCount = 0;

// Circle/spiral tracking
let pAcc;
let acc;
let angleSum = 0;
let circleTimer = 0;
let dir = 1;
// Circle drawing
let startDir;
let startAngle = 0;
let smileTime = -1;
let vectorLeft;

// Shake tracking
let timer = -1;
let timeout = 333;
let shakes = 0;
let shakeThresh = 20;
let delay = -1;
// Shake image displaying
let imgs = [];
let imgIndex = 0;
let imgAlpha = 0;

function preload() {
  // Load images before setup
  for (let i = 0; i < 3; i++)
    imgs.push(loadImage('images/broken'+i+'.jpg'));
}

function setup() {
  // Setup
  createCanvas(windowWidth, windowHeight);
  textSize(80);
  textAlign(CENTER);
  setShakeThreshold(40);
  vectorLeft = createVector(-1,0);
  pAcc = createVector(0,0);
  acc = createVector(0,0);
  startDir = createVector(0,0);
  for (let i = 0; i < 3; i++)
    imgs[i].resize(width, height);
  
  // Request access to device motion + orientation if it has not been granted previously
  if (typeof(DeviceMotionEvent) !== 'undefined' && typeof(DeviceMotionEvent.requestPermission) === 'function') {
    DeviceMotionEvent.requestPermission()
      .catch(() => {
        let button = createButton("Allow access to device motion and orientation");
        button.style('font-size', '40px');
        button.size(600,200);
        button.center();
        button.mousePressed(requestAccess);
        return;
    })
      .then(() => {
        permission = true;
    })
  } 
  else {
    text("Not iOS 13+", width/2, height/2-100);
    text("Can't access device motion/orientation", height/2, height/2);
  }
}

function draw() {
  if (!permission) return;

  // Background and counts text
  background(255);
  stroke(0);
  strokeWeight(1);
  fill(0);
  text("Circles: " + str(circleCount), width/2, height/2-500);
  text("Shakes: " + str(shakeCount), width/2, height/2-400);
  
  // Tracking circle/spiral
  if (acc.mag() > 3) {
    let angle = pAcc.angleBetween(acc);

    // Check for starting circle
    if (angleSum <= 0) {
      startAngle = acc.angleBetween(vectorLeft);
      dir = angle < 0 ? -1 : 1;
    }

    if (angle*dir > 0) {
   	  // Making circle
      angleSum += angle*dir;
      if (angleSum > 2.25*PI) {
      	// Circle completed
        if (circleTimer > 450) {
          circleCount++;
          smileTime = 225;
        }
        angleSum = 0;
      }
    } else {
      // Circle broken, reset it
      angleSum = 0;
   	}
  } else
    angleSum = 0;
  
  // Smiley face if circle recently completed
  if (smileTime > 0)
  {
    smileyFace();
    smileTime -= deltaTime;
  }
  
  // Circle timer and drawing
  if (angleSum > 0) {
    circleTimer += deltaTime;
    if (smileTime <= 0)
    	drawCirclePortion();
  } else
    circleTimer = 0;
  
  // Images for shakes
  tint(255, imgAlpha);
  image(imgs[imgIndex], 0, 0);
  
  // Timers for shake + delay bewteen shakes
  if (timer > 0) {
    timer -= deltaTime;
    if (timer < 0)
      shakes = 0;
  }
  if (delay > 0) {
    delay -= deltaTime;
    shakes = 0;
    if (delay < 0)
      imgAlpha = 0;
  }
  
  // Set previous and current acceleration for circle tracking
  pAcc.set(acc);
  acc.set(accelerationX, accelerationY);
}

// Built in shake (change in x or y acceleration > threshold)
function deviceShaken() {
  //Timers
  if (delay > 0)
    return;
  if (timer < 0) {
    timer = timeout;
    shakes = 0;
  }
  
  shakes++;
  
  // Completed shake
  if (shakes > shakeThresh) {
    imgIndex = random([0,1,2]);
    imgAlpha = 255;
    timer = -1;
    shakeCount++;
    delay = timeout/2;
    shakes = 0;
  }
}

// Device orientation and motion request on button click
function requestAccess() {
  DeviceMotionEvent.requestPermission()
    .then(response => {
      if (response == 'granted')
        permission = true;
      else
        permission = false;
    })
    .catch(console.error)
  this.remove();
}

// Draw arc representing circle being made with phone 
function drawCirclePortion() {
  let sum2 = lerp(0, TWO_PI, angleSum/(2.25*PI));
  stroke(0,0,255);
  strokeWeight(6);
  noFill();
  if (dir < 0)
    arc(width/2, height/2+100, 400, 400, startAngle, startAngle+sum2);
  else
    arc(width/2, height/2+100, 400, 400, startAngle-sum2, startAngle);
}

// Draw a smiley face
function smileyFace() {
  stroke(0,0,255);
  strokeWeight(6);
  noFill();
  ellipse(width/2, height/2+100, 400, 400);
  arc(width/2, height/2+100, 250, 250, PI/10, 9*PI/10);
  fill(0,0,255);
  ellipse(width/2-60, height/2+10, 30, 30);
  ellipse(width/2+60, height/2+10, 30, 30);
}
