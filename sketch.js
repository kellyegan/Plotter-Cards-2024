function setup() {
  createCanvas(400, 600);
  background(220);

  // beginRecordSVG(this, "hello.svg");
  // line(20, 20, width - 20, height - 20);
  // line(20, height - 20, width - 20, 20);
  // endRecordSVG();

  // noLoop();

  let projection = math.matrix([
    [1, 0, 0],
    [0, 1, 0],
  ]);

  let point = math.matrix([100, 75, 50]);
  let projectedPoint = math.multiply(projection, point);
  console.log(projectedPoint);
}
