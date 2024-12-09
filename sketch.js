let scene;

let eyeSpacing = 0.04;

let leftCamera;
let rightCamera;

let angle = 0;

function setup() {
  createCanvas(900, 600);

  leftCamera = new Camera(-eyeSpacing / 2, 0, -1.75, 1);
  rightCamera = new Camera(eyeSpacing / 2, 0, -1.75, 1);

  scene = new Scene();

  stroke(255);
  strokeWeight(2);

  // noLoop();
}

function draw() {
  blendMode(BLEND);
  background(0);

  // beginRecordSVG(this, "hello.svg");

  translate(width / 2, height / 2);
  // for (let angle = 0; angle < TAU; angle += TAU / 16) {
  angle += 0.02;
  scene.reset();
  scene.translate(0, 0, 8.5);
  // scene.rotateX(-1.0);
  scene.translate(cos(angle) * 2.5, 0, sin(angle) * 4);

  scene.rotateX(angle);
  scene.rotateY(angle);
  scene.rotateZ(angle);

  // scene.add(new Cube(1));
  scene.add(new Dodecahedron(1));

  blendMode(SCREEN);
  stroke("cyan");
  scene.render(leftCamera);

  stroke("red");
  scene.render(rightCamera);
  // }

  // endRecordSVG();
}
