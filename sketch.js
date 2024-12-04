function setup() {
  createCanvas(400, 600);
  background(220);

  // beginRecordSVG(this, "hello.svg");
  // line(20, 20, width - 20, height - 20);
  // line(20, height - 20, width - 20, 20);
  // endRecordSVG();

  // noLoop();

  let projection = [
    [1, 0, 0],
    [0, 1, 0],
  ];

  let point = [[100, 75, 50]];

  let projectedPoint = matmul(projection, point);

  console.log(projectedPoint);
}

function matmul(matA, matB) {
  let result = [];
  return result;
}
