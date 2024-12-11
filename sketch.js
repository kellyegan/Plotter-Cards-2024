let scene;

let eyeSpacing = 0.04;

let leftCamera;
let rightCamera;
let model;
let mesh1, mesh2;
let cube;
let createSVG = false;

let angle = 0;

function preload() {
  model = loadModel("models/Solids-Cube.stl");
}

function setup() {
  createCanvas(600, 400);

  leftCamera = new WeakPerspectiveCamera(-eyeSpacing / 2, 0, -4);
  rightCamera = new WeakPerspectiveCamera(eyeSpacing / 2, 0, -4);

  scene = new Scene();

  stroke(255);
  strokeWeight(2);

  mesh1 = createMeshFromModel(model);
  cube = new Cube(1);

  console.log(mesh1);
  console.log(cube);
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

  // scene.rotateX(PI / 8);
  // scene.rotateY(-PI / 8);

  scene.add(cube);
  scene.add(mesh1);

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
