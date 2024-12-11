let scene;

let eyeSpacing = 0.04;

let leftCamera;
let rightCamera;
let model;
let mesh;
let tetrahedron;

let angle = 0;

function preload() {
  model = loadModel("Solids-Icostar.stl");
}

function setup() {
  createCanvas(900, 600);

  leftCamera = new WeakPerspectiveCamera(-eyeSpacing / 2, 0, -1.75);
  rightCamera = new WeakPerspectiveCamera(eyeSpacing / 2, 0, -1.75);

  scene = new Scene();

  stroke(255);
  strokeWeight(2);

  mesh = createMeshFromModel( model );
  tetrahedron = new Tetrahedron(1);

  // noLoop();
}

function draw() {
  blendMode(BLEND);
  background(0);

  // beginRecordSVG(this, "hello.svg");

  translate(width / 2, height / 2);
  // for (let angle = 0; angle < TAU; angle += TAU / 16) {
  angle += 0.01;
  scene.reset();
  scene.translate(0, 0, 8.5);
  // scene.rotateX(-1.0);
  scene.translate(cos(angle) * 2.5, 0, sin(angle) * 4);

  scene.rotateX(angle);
  scene.rotateY(angle);
  scene.rotateZ(angle);

  // let polyline = new Polyline();
  // polyline.add(1, 0, 0);
  // polyline.add(1, 1, 0); //+y
  // polyline.add(1, 1, 1); //+z
  // polyline.add(2, 1, 1); //+x
  // polyline.add(2, 2, 1); //+y
  // polyline.add(2, 2, 2); //+z
  // polyline.add(3, 2, 2); //+x
  // scene.add(polyline);

  // scene.add(new Cube(1));
  // scene.add(tetrahedron);

  scene.add(mesh);

  blendMode(SCREEN);
  stroke("cyan");
  scene.render(leftCamera);

  stroke("red");
  scene.render(rightCamera);
  // }

  // endRecordSVG();
}
