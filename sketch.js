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

let angle = 0;

function setup() {
  createCanvas(400, 600);

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
  strokeWeight(10);
}

function draw() {
  background(220);
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

  // Perspective 2d project
  let distance = 2;
  projectedPoints = rotatedPoints.map((p) => {
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

  projectedPoints.forEach((p) => {
    let x = p.get([0]);
    let y = p.get([1]);
    point(x, y);
  });
}
