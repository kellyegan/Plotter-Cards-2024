function setup() {
  createCanvas(400, 600);
  background(220);

  beginRecordSVG(this, "hello.svg");
  line(20, 20, width - 20, height - 20);
  line(20, height - 20, width - 20, 20);
  endRecordSVG();

  noLoop();
}
