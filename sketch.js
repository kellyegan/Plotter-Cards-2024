let scene;

let eyeSpacing = 0.04;

let leftCamera;
let rightCamera;

let modelIndex;
let currentModelMesh;
let currentModelName;
let newModelLoaded = false;

let paused = true;
let showLabels = false;

let jsonMeshData;

let createSVG = false;

let xAngle, yAngle, xStart, yStart;

function preload() {}

function setup() {
  createCanvas(750, 500);

  xAngle = (15 * TAU) / 360;
  yAngle = -(15 * TAU) / 360;
  xStart = 0;
  yStart = 0;

  models = [
    "Solids-Bauble1",
    "Solids-Bauble2",
    "Solids-Cube",
    "Solids-UVStar",
    "Solids-CubeStar1",
    "Solids-HerringboneStar1",
    "Solids-HerringboneStar2",
    "Solids-IcoStar1",
    "Solids-IcoStar2",
    "Solids-RhombicTriacontahedronStar",
    "Solids-Star8Points",
    "Solids-TriakisIcosahedron",
    "Solids-TruncatedDodecahedron",
    "Solids-TruncatedDodecahedronMorph",
    "Solids-TruncatedDodecahedronMorphStar1",
    "Solids-TruncatedDodecahedronMorphStar2",
    "Solids-TruncatedDodecahedronMorphStar3",
    "Solids-TruncatedDodecahedronStar1",
    "Solids-TruncatedDodecahedronStar2",
  ];

  modelIndex = 0;
  loadJSONModel(modelIndex);

  leftCamera = new WeakPerspectiveCamera(-eyeSpacing / 2, 0.02, -3);
  rightCamera = new WeakPerspectiveCamera(eyeSpacing / 2, 0.02, -3);

  scene = new Scene();

  stroke(255);
  strokeWeight(2);

  // saveJSON(modelMesh, "json/Solids-TruncatedDodecahedron.json");

  tetrahedron = new Tetrahedron(1);
}

function draw() {
  blendMode(BLEND);
  background(255);

  if (newModelLoaded) {
    if (createSVG) {
      beginRecordSVG(this, `${currentModelName}`);
    }

    translate(width / 2, height / 2);
    // angle += 0.005;
    scene.reset();

    if (!paused) {
      xAngle = map(mouseY, 0, height, -PI / 2, PI / 2);
      yAngle = map(mouseX, 0, width, 0, PI);
    }

    scene.rotateX(xAngle);
    scene.rotateY(yAngle);

    scene.add(currentModelMesh);

    //Stereo render
    if (!showLabels) {
      stroke("cyan");
      scene.render(leftCamera);
    }

    stroke("red");
    scene.render(rightCamera, showLabels);

    if (createSVG) {
      endRecordSVG();
      createSVG = false;
    }
  }
}

function mousePressed() {
  xStart = mouseX;
  yStart = mouseY;
  paused = !paused;
}

function keyPressed() {
  switch (keyCode) {
    case RIGHT_ARROW:
      modelIndex = (modelIndex + 1) % models.length;
      console.log(modelIndex);
      loadJSONModel(modelIndex);
      break;
    case LEFT_ARROW:
      modelIndex--;
      if (modelIndex < 0) modelIndex = models.length - 1;
      console.log(modelIndex);
      loadJSONModel(modelIndex);
      break;
  }

  switch (key) {
    case "s":
    case "S":
      createSVG = true;
      break;
    case "l":
    case "L":
      showLabels = !showLabels;
      break;
    case "j":
    case "J":
      saveJSON(currentModelMesh, currentModelName);
      break;
    case "d":
      currentModelMesh.deleteVertex([
        123, 128, 133, 138, 135, 140, 144, 70, 72, 66, 68, 64,
      ]);
      break;
  }
}

function loadSTLModel(index) {
  newModelLoaded = false;
  currentModelName = models[index];
  loadModel(`models/${models[index]}.stl`, onModelLoaded, onModelFailed);
  console.log(`Loading ${models[index]}`);
}

function loadJSONModel(index) {
  newModelLoaded = false;
  currentModelName = models[index];
  loadJSON(`json/${models[index]}.json`, onJSONLoaded, onJSONFailed);
  console.log(`Loading ${models[index]}`);
}

function onModelLoaded(modelData) {
  console.log("Loaded STL!");
  currentModelMesh = createMeshFromModel(modelData);
  newModelLoaded = true;
}

function onModelFailed(error) {
  console.log("ERROR: " + error);
}

function onJSONLoaded(modelData) {
  console.log("Loaded JSON!");
  currentModelMesh = createMeshFromJSONdata(modelData);
  newModelLoaded = true;
}

function onJSONFailed(error) {
  console.log("Failed to load JSON. Loading STL...");
  loadSTLModel(modelIndex);
}
