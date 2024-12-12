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
    "Solids-Bauble1.stl",
    "Solids-Bauble2.stl",
    "Solids-UVStar.stl",
    "Solids-CubeStar1.stl",
    "Solids-HerringboneStar1.stl",
    "Solids-HerringboneStar2.stl",
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
  ];

  modelIndex = 0;
  loadSTLModel(modelIndex);

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
      loadSTLModel(modelIndex);
      break;
    case LEFT_ARROW:
      modelIndex--;
      if (modelIndex < 0) modelIndex = models.length - 1;
      console.log(modelIndex);
      loadSTLModel(modelIndex);
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
  }
}

function loadSTLModel(index) {
  newModelLoaded = false;
  currentModelName = models[index].split(".")[0];
  loadModel("models/" + models[index], onModelLoaded, onModelFailed);
  console.log(`Loading ${currentModelName}`);
}

function onModelLoaded(modelData) {
  console.log("Loaded!");
  currentModelMesh = createMeshFromModel(modelData);
  newModelLoaded = true;
}

function onModelFailed(error) {
  console.log("ERROR: " + error);
}
