let scene;

let eyeSpacing = 0.06;

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

let bgModelTransforms;

let spiralMesh;

function preload() {}

function setup() {
  createCanvas(750, 500);

  xAngle = (15 * TAU) / 360;
  yAngle = -(15 * TAU) / 360;
  xStart = 0;
  yStart = 0;

  models = [
    "Spiral1",
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

  // Generate spiral count, radius1, radius2, height, twist
  spiralMesh = generateSpiral(48, 0.5, 0.5, 1);

  // setBackgroundTransforms();

  modelIndex = 0;
  loadJSONModel(modelIndex);

  leftCamera = new WeakPerspectiveCamera(-eyeSpacing / 2, 0.02, -3);
  rightCamera = new WeakPerspectiveCamera(eyeSpacing / 2, 0.02, -3);

  scene = new Scene();

  stroke(255);
  strokeWeight(1);

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

    // bgModelTransforms.forEach((t, i) => {
    //   scene.pushMatrix();
    //   scene.translate(0, 0, t[3]);
    //   scene.rotateZ(t[4] + (i * TAU) / bgModelTransforms.length);
    //   scene.translate(3.5, 0, 0);
    //   scene.rotateX(t[0]);
    //   scene.rotateY(t[1]);
    //   scene.rotateZ(t[2]);
    //   scene.add(currentModelMesh);
    //   scene.popMatrix();
    // });

    // scene.pushMatrix();
    // scene.translate(0, 0, -1.5);
    // scene.rotateX(PI / 2);
    //
    // scene.popMatrix();

    if (!paused) {
      xAngle = map(mouseY, 0, height, -PI / 2, PI / 2);
      yAngle = map(mouseX, 0, width, 0, PI);
    }

    // scene.translate(0, 0, -8);
    scene.rotateX(xAngle);
    scene.rotateY(yAngle);
    const s = 3;
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
      j;
      showLabels = !showLabels;
      break;
    case "j":
    case "J":
      saveJSON(currentModelMesh, currentModelName);
      break;
    case "d":
      break;
    case " ":
      setBackgroundTransforms();
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

function generateSpiral(count = 20, r1 = 0.5, r2 = 0.5, h = 1, t = 2) {
  const a = TAU / count;
  const spiral = new Mesh();

  for (let i = 0; i < count; i++) {
    spiral.vertices.push([r1 * sin(a * i), -h / 2, r2 * cos(a * i), 1]);
    spiral.vertices.push([r1 * sin(t + a * i), h / 2, r2 * cos(t + a * i), 1]);
    spiral.edges.push([spiral.vertices.length - 2, spiral.vertices.length - 1]);
  }

  console.log(spiral);

  return spiral;
}

function setBackgroundTransforms(count = 9) {
  bgModelTransforms = [];
  for (let i = 0; i < count; i++) {
    bgModelTransforms.push([
      random(0, TAU),
      random(0, TAU),
      random(0, TAU),
      random(-8, -12),
      random(-PI / 16, PI / 16),
    ]);
  }
}
