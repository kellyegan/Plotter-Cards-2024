let scene;

let eyeSpacing = 0.04;

let leftCamera;
let rightCamera;
let model;
let mesh;
let tetrahedron;
let createSVG = false;

let angle = 0;

function preload() {
  model = loadModel("models/Solids-Cube.stl");
}

function setup() {
  createCanvas(400, 600);

  leftCamera = new WeakPerspectiveCamera(-eyeSpacing / 2, 0, -1.75);
  rightCamera = new WeakPerspectiveCamera(eyeSpacing / 2, 0, -1.75);

  scene = new Scene();

  stroke(255);
  strokeWeight(2);

  mesh = createMeshFromModel(model);
  tetrahedron = new Tetrahedron(1);

  noLoop();
}

function draw() {
  blendMode(BLEND);
  background(255);

  if (createSVG) {
    beginRecordSVG(this, "hello.svg");
  }

  translate(width / 2, height / 2);
  // for (let angle = 0; angle < TAU; angle += TAU / 16) {
  angle += 0.005;
  scene.reset();

  scene.rotateX(PI / 8);
  scene.rotateY(-PI / 8);

  scene.add(new Cube(1));
  scene.add(mesh);

  //Stereo render
  // blendMode(SCREEN);
  stroke("cyan");
  scene.render(leftCamera, true);

  stroke("red");
  scene.render(rightCamera);

  if (createSVG) {
    endRecordSVG();
  }
}
