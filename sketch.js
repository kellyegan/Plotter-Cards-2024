function setup() {
  createCanvas(400, 600);
  background(220);

  // beginRecordSVG(this, "hello.svg");
  // line(20, 20, width - 20, height - 20);
  // line(20, height - 20, width - 20, 20);
  // endRecordSVG();

  // noLoop();

  let points = [
    math.matrix([-50, -50, 0]),
    math.matrix([50, -50, 0]),
    math.matrix([50, 50, 0]),
    math.matrix([-50, 50, 0]),
  ];

  let angle = PI / 4;
  let rotation = math.matrix([
    [cos(angle), -sin(angle), 0],
    [sin(angle), cos(angle), 0],
    [0, 0, 1],
  ]);

  let projection = math.matrix([
    [1, 0, 0],
    [0, 1, 0],
  ]);

  console.log("3D points");
  points.forEach((point) => {
    console.log(point.toString());
  });

  rotatedPoints = points.map((p) => {
    return math.multiply(rotation, p);
  });

  projectedPoints = rotatedPoints.map((p) => {
    return math.multiply(projection, p);
  });

  stroke(0);
  strokeWeight(10);
  translate(width / 2, height / 2);

  console.log("Projected points");
  projectedPoints.forEach((p) => {
    print(p.toString());

    let x = p.get([0]);
    let y = p.get([1]);
    point(x, y);
  });
}
