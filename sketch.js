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
  models = [
    "models/Solids-UVStar.stl",
    "models/Solids-Cube.stl",
    "models/Solids-CubeStar1.stl",
    "models/Solids-IcoStar1.stl",
    "models/Solids-IcoStar2.stl",
    "models/Solids-RhombicTriacontahedronStar.stl",
  ];

  model = loadModel(models[0]);
}

function setup() {
  createCanvas(600, 400);
  createCanvas(600, 400);

  leftCamera = new WeakPerspectiveCamera(-eyeSpacing / 2, 0.02, -3);
  rightCamera = new WeakPerspectiveCamera(eyeSpacing / 2, 0.02, -3);

  scene = new Scene();

  stroke(255);
  strokeWeight(2);

  mesh1 = createMeshFromModel(model);
  cube = new Cube(1);

  console.log(mesh1);
  console.log(cube);
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
  angle += 0.005;
  scene.reset();

  scene.rotateX((15 * TAU) / 360);
  scene.rotateY(-(15 * TAU) / 360);
  // scene.rotateY(-PI / 8);

  scene.add(mesh1);

  //Stereo render
  // blendMode(SCREEN);
  stroke("cyan");
  scene.render(leftCamera);

  stroke("red");
  scene.render(rightCamera);

  if (createSVG) {
    endRecordSVG();
  }
}
