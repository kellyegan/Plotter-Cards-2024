let points = [
  math.matrix([-0.5, -0.5, -0.5]),
  math.matrix([0.5, -0.5, -0.5]),
  math.matrix([0.5, 0.5, -0.5]),
  math.matrix([-0.5, 0.5, -0.5]),
  math.matrix([-0.5, -0.5, 0.5]),
  math.matrix([0.5, -0.5, 0.5]),
  math.matrix([0.5, 0.5, 0.5]),
  math.matrix([-0.5, 0.5, 0.5]),
];

let orthographicProjection = math.matrix([
  [1, 0, 0],
  [0, 1, 0],
]);

let eyeSpacing = 0.04;
let leftCamera = math.matrix([-eyeSpacing / 2, 0, -1]);
let rightCamera = math.matrix([eyeSpacing / 2, 0, -1]);

let angle = 0;

function setup() {
  createCanvas(600, 900);
  let cube = new Cube(1);

  // beginRecordSVG(this, "hello.svg");
  // line(20, 20, width - 20, height - 20);
  // line(20, height - 20, width - 20, 20);
  // endRecordSVG();

  // noLoop();

  // console.log("3D points");
  // points.forEach((point) => {
  //   console.log(point.toString());
  // });

  stroke(0);
  strokeWeight(5);
}

function draw() {
  blendMode(BLEND);
  background(0);
  translate(width / 2, height / 2);

  angle += 0.02;

  let rotationX = math.matrix([
    [1, 0, 0],
    [0, cos(angle), -sin(angle)],
    [0, sin(angle), cos(angle)],
  ]);

  let rotationY = math.matrix([
    [cos(angle), 0, -sin(angle)],
    [0, 1, 0],
    [sin(angle), 0, cos(angle)],
  ]);

  let rotationZ = math.matrix([
    [cos(angle), -sin(angle), 0],
    [sin(angle), cos(angle), 0],
    [0, 0, 1],
  ]);

  rotatedPoints = points.map((p) => {
    return math.multiply(rotationX, p);
  });

  rotatedPoints = rotatedPoints.map((p) => {
    return math.multiply(rotationY, p);
  });

  rotatedPoints = rotatedPoints.map((p) => {
    return math.multiply(rotationZ, p);
  });

  // Orthgraphic 2d project
  // projectedPoints = rotatedPoints.map((p) => {
  //   return math.multiply(orthographicProjection, p);
  // });

  let distance = 0.5;
  blendMode(SCREEN);
  // Left camera
  stroke("red");
  let leftCameraPoints = rotatedPoints.map((p) => {
    return math.add(p, leftCamera);
  });

  // Weak perspective 2d project

  projectedPoints = leftCameraPoints.map((p) => {
    let zScale = 1 / (distance - p.get([2]));
    let perspectiveProjection = math.matrix([
      [zScale, 0, 0],
      [0, zScale, 0],
    ]);

    const projected = math.multiply(perspectiveProjection, p);

    return math.multiply(projected, 200);
  });

  // scaledPoints = math.multiply(2, projectedPoints);
  // console.log(scaledPoints.size());
  strokeWeight(3);
  connect(projectedPoints[0], projectedPoints[1]);
  connect(projectedPoints[1], projectedPoints[2]);
  connect(projectedPoints[2], projectedPoints[3]);
  connect(projectedPoints[3], projectedPoints[0]);

  connect(projectedPoints[4], projectedPoints[5]);
  connect(projectedPoints[5], projectedPoints[6]);
  connect(projectedPoints[6], projectedPoints[7]);
  connect(projectedPoints[7], projectedPoints[4]);

  connect(projectedPoints[0], projectedPoints[4]);
  connect(projectedPoints[1], projectedPoints[5]);
  connect(projectedPoints[2], projectedPoints[6]);
  connect(projectedPoints[3], projectedPoints[7]);

  strokeWeight(5);
  for (let i = 0; i < projectedPoints.length; i++) {
    let x = projectedPoints[i].get([0]);
    let y = projectedPoints[i].get([1]);
    point(x, y);
  }

  // Left camera
  stroke("cyan");
  let rightCameraPoints = rotatedPoints.map((p) => {
    return math.add(p, rightCamera);
  });

  // Weak perspective 2d project
  projectedPoints = rightCameraPoints.map((p) => {
    let zScale = 1 / (distance - p.get([2]));
    let perspectiveProjection = math.matrix([
      [zScale, 0, 0],
      [0, zScale, 0],
    ]);

    const projected = math.multiply(perspectiveProjection, p);

    return math.multiply(projected, 200);
  });

  // scaledPoints = math.multiply(2, projectedPoints);
  // console.log(scaledPoints.size());
  strokeWeight(3);
  connect(projectedPoints[0], projectedPoints[1]);
  connect(projectedPoints[1], projectedPoints[2]);
  connect(projectedPoints[2], projectedPoints[3]);
  connect(projectedPoints[3], projectedPoints[0]);

  connect(projectedPoints[4], projectedPoints[5]);
  connect(projectedPoints[5], projectedPoints[6]);
  connect(projectedPoints[6], projectedPoints[7]);
  connect(projectedPoints[7], projectedPoints[4]);

  connect(projectedPoints[0], projectedPoints[4]);
  connect(projectedPoints[1], projectedPoints[5]);
  connect(projectedPoints[2], projectedPoints[6]);
  connect(projectedPoints[3], projectedPoints[7]);

  strokeWeight(5);
  for (let i = 0; i < projectedPoints.length; i++) {
    let x = projectedPoints[i].get([0]);
    let y = projectedPoints[i].get([1]);
    point(x, y);
  }
}

function connect(a, b) {
  line(a.get([0]), a.get([1]), b.get([0]), b.get([1]));
}

class Mesh {
  vertices;
  edges;

  constructor() {
    this.vertices = [];
    this.edges = [];
  }
}

class Cube extends Mesh {
  size;

  constructor(size) {
    super();

    this.size = size;

    // Generate vertices
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        let x = -this.size / 2 + ((this.size * Math.floor((j + 1) / 2)) % 2);
        let y = -this.size / 2 + ((this.size * Math.floor(j / 2)) % 2);
        let z = -this.size / 2 + this.size * i;

        this.vertices.push(math.matrix([x, y, z]));
      }
    }

    //Generate edges
    this.edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];
  }
}
