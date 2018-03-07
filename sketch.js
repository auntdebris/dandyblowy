//JSON
var params = {
  displayMode: true,
  debugMode: false,
  windMode: false,
  n: 4.5,
  d: 12.3,
  t: 80,
  s: 105,
  c: 0,
  angle: 0,
  step: 2,
  p: 20,
  test: 12
};

// var gui = new dat.gui.GUI();
// gui.add(params, "displayMode");
// gui.add(params, "debugMode");
// gui.add(params, "windMode");
// gui.add(params, "s").min(20).max(350).step(1);
// gui.add(params, "angle").min(-5).max(5).step(0.01);
// gui.add(params, "t").min(40).max(400).step(1);
// gui.add(params, "test").min(1).max(15).step(0.1);
// gui.add(params, "c").min(0).max(100).step(1);
// gui.add(params, "step").min(1).max(2).step(0.1);
// gui.add(params, "n").min(1).max(10).step(0.1);
// gui.add(params, "d").min(1).max(30).step(0.1);
// gui.add(params, "p").min(1).max(20).step(1);


// for particles
var particles = [];
var alpha_value = 0;
var centerBranch;
var blowArea = 0;
var blowStrength = 0;

var mic;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textSize(12);
  for (var i = 0; i < 200; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  centerBranch = createVector(width / 2, height * 2 / 3);

  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();
}


function draw() {

  var vol = mic.getLevel();

  if (vol > 0.05) {
    console.log(vol)
    params.displayMode = false
    params.windMode = true
  }
  background(0);

  //main branch display
  if (params.displayMode || params.windMode) {
    push();
    strokeWeight(0.5);
    stroke(255, 100);
    line(centerBranch.x, height, centerBranch.x, centerBranch.y);
    pop();
  }

  // particle display
  for (var i = 0; i < particles.length; i++) {
    if (params.displayMode) {
      particles[i].moveWithLerp();
    } else if (params.windMode) {
      if (blowArea < params.s + 5 / params.test) {
        blowArea += 0.01;
      }
      var distance = particles[i].pos.dist(centerBranch);
      if (distance > params.s - blowArea + 5) {
        particles[i].wind(vol);
      }
    } else {
      // particles[i].checkBoundaries();
    }
    particles[i].update();
    particles[i].display();
  }

  push();
  translate(centerBranch.x, centerBranch.y);
  var count = 0;
  for (var a = 0; a < TWO_PI * params.t; a += params.step) {
    //clock shape
    noStroke();
    // if (params.debugMode) {
    //   alpha_value = 0;
    // } else {
    //   alpha_value = 0;
    // }
    fill(255, alpha_value);
    var k = params.n / params.d;
    var r = params.s * cos(k * a) + params.c;
    var x = r * cos(a) + (r / params.p) * cos(params.angle);
    var y = r * sin(a) + (r / params.p) * sin(params.angle);
    ellipse(x, y, 3, 3);
    //match
    if (count < particles.length) {
      particles[count].targetPos = createVector(x + centerBranch.x, y + centerBranch.y);
    }
    count++;
  }
  //count adjustment
  if (count < particles.length) {
    particles.pop();
  } else if (count > particles.length) {
    particles.push(new Particle(centerBranch.x, centerBranch.y));
  }
  pop();
  if (params.debugMode) {
    // text display
    fill(255);
    text("frameRate:" + round(frameRate()), 15, 30);
    text("count:" + count, 15, 50);
    text("# of particles:" + particles.length, 15, 70);
    //text("r = s * cos(n / d * theta) + c", 15, 90);
    //text("x = r * cos(theta) + r / p * cos(angle)", 15, 110);
    //text("y = r * sin(theta) + r / p * sin(angle)", 15, 130);
    stroke(255);
    noFill();
    //ellipse(centerBranch.x, centerBranch.y, 2 * params.s + params.c, 2 * params.s + params.c);
    ellipse(centerBranch.x, centerBranch.y, blowArea, blowArea);

  }
}