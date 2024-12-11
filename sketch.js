let scene;

let eyeSpacing = 0.04;

let leftCamera;
let rightCamera;
let model;
let modelName;
let modelMesh, mesh2;
let jsonMeshData;
let cube;
let createSVG = false;

let angle = 0;

function preload() {
  models = [
    "Solids-CubeStar1.stl",
    "Solids-IcoStar1.stl",
    "Solids-IcoStar2.stl",
    "Solids-RhombicTriacontahedronStar.stl",
    "Solids-Star8Points.stl",
    "Solids-TriakisIcosahedron.stl",
    "Solids-TruncatedDodecahedron.stl",
    "Solids-TruncatedDodecahedronMorph.stl",
    "Solids-TruncatedDodecahedronMorphStar1.stl",
    "Solids-TruncatedDodecahedronMorphStar2.stl",
    "Solids-TruncatedDodecahedronMorphStar3.stl",
    "Solids-TruncatedDodecahedronStar1.stl",
    "Solids-TruncatedDodecahedronStar2.stl",
    "Solids-UVStar.stl",
  ];

  let modelPath = models[4];
  console.log(modelPath);
  model = loadModel("models/" + modelPath);
  modelName = modelPath.split(".")[0];

  jsonMeshData = loadJSON("json/Solids-TruncatedDodecahedron.json");
}

function setup() {
  createCanvas(750, 500);

  leftCamera = new WeakPerspectiveCamera(-eyeSpacing / 2, 0.02, -3);
  rightCamera = new WeakPerspectiveCamera(eyeSpacing / 2, 0.02, -3);

  scene = new Scene();

  stroke(255);
  strokeWeight(2);

  modelMesh = createMeshFromModel(model);
  // modelMesh = createMeshFromJSONdata(jsonMeshData);

  console.log(modelName);
  // saveJSON(modelMesh, "json/Solids-TruncatedDodecahedron.json");

  tetrahedron = new Tetrahedron(1);

  // noLoop();
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
  scene.rotateY(-(30 * TAU) / 360);
  // scene.rotateY(angle);

  scene.add(modelMesh);

  //Stereo render
  // blendMode(SCREEN);
  stroke("cyan");
  scene.render(leftCamera);

  stroke("red");
  scene.render(rightCamera, false);

  if (createSVG) {
    endRecordSVG();
  }
}
