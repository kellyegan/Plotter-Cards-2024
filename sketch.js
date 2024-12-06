let points = [
  math.matrix([-0.5, -0.5, -0.5, 1]),
  math.matrix([0.5, -0.5, -0.5, 1]),
  math.matrix([0.5, 0.5, -0.5, 1]),
  math.matrix([-0.5, 0.5, -0.5, 1]),
  math.matrix([-0.5, -0.5, 0.5, 1]),
  math.matrix([0.5, -0.5, 0.5, 1]),
  math.matrix([0.5, 0.5, 0.5, 1]),
  math.matrix([-0.5, 0.5, 0.5, 1]),
];

let scene;

let eyeSpacing = 0.04;
let leftCamera = math.matrix([-eyeSpacing / 2, 0, -1, 1]);
let rightCamera = math.matrix([eyeSpacing / 2, 0, -1, 1]);

let angle = 0;

function setup() {
  createCanvas(600, 900);

  scene = new Scene();
  scene.add(new Cube(1));

  // beginRecordSVG(this, "hello.svg");
  // line(20, 20, width - 20, height - 20);
  // line(20, height - 20, width - 20, 20);
  // endRecordSVG();

  stroke(255);
  strokeWeight(5);
}

function draw() {
  blendMode(BLEND);
  background(0);
  translate(width / 2, height / 2);

  angle += 0.02;

  let rotationX = math.matrix([
    [1, 0, 0, 0],
    [0, cos(angle), -sin(angle), 0],
    [0, sin(angle), cos(angle), 0],
    [0, 0, 0, 1],
  ]);

  let rotationY = math.matrix([
    [cos(angle), 0, -sin(angle), 0],
    [0, 1, 0, 0],
    [sin(angle), 0, cos(angle), 0],
    [0, 0, 0, 1],
  ]);

  let rotationZ = math.matrix([
    [cos(angle), -sin(angle), 0, 0],
    [sin(angle), cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);

  transform = math.identity(4, 4);
  transform = math.multiply(transform, rotationX);
  transform = math.multiply(transform, rotationY);
  transform = math.multiply(transform, rotationZ);

  rotatedPoints = points.map((p) => {
    return math.multiply(transform, p);
  });

  blendMode(SCREEN);
  stroke("cyan");
  scene.render(leftCamera, 0.5);

  stroke("red");
  scene.render(rightCamera, 0.5);
}

function connect(a, b) {
  line(a.get([0]), a.get([1]), b.get([0]), b.get([1]));
}

class Mesh {
  vertices;
  edges;
  transform;

  constructor() {
    this.vertices = [];
    this.edges = [];
    this.transform = math.identity(4, 4);
  }

  projectOrtho() {
    // 1. Apply object transform
    const transformedVerts = this.vertices.map((v) => {
      return math.multiply(this.transform, v);
    });

    // 2. Apply orthographic projection
    let orthographicProjection = math.matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ]);
    projectedVerts = transformedVerts.map((p) => {
      return math.multiply(orthographicProjection, p);
    });

    // 4. Scale up verts (this could be done better)
    const scaledVerts = projectedVerts.map((v) => {
      return math.multiply(v, 200);
    });

    return scaledVerts;
  }

  projectPerspective(camera, distance) {
    // 1. Apply object transform
    const transformedVerts = this.vertices.map((v) => {
      return math.multiply(this.transform, v);
    });

    // 2. Transform points in relation to camera
    const cameraRelativeVerts = transformedVerts.map((p) => {
      return math.add(p, camera);
    });

    // 3. Project to 2D (using weak perspective)
    const projectedVerts = cameraRelativeVerts.map((v) => {
      let zScale = 1 / (distance - v.get([2]));
      let perspectiveProjection = math.matrix([
        [zScale, 0, 0, 0],
        [0, zScale, 0, 0],
      ]);

      return math.multiply(perspectiveProjection, v);
    });

    // 4. Scale up verts (this could be done better)
    const scaledVerts = projectedVerts.map((v) => {
      return math.multiply(v, 200);
    });

    return scaledVerts;
  }

  render(camera, distance) {
    const projectedVerts = this.projectPerspective(camera, distance);
    //Draw edges between projected vertices
    this.edges.forEach((edge) => {
      connect(projectedVerts[edge[0]], projectedVerts[edge[1]]);
    });
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

        this.vertices.push(math.matrix([x, y, z, 1]));
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

class Scene {
  objects;
  cameras;
  transform;
  stack;

  constructor() {
    this.objects = [];
    this.cameras = [];
    this.transform = math.identity(4, 4);
    this.stack = [];
  }

  add(shape) {
    this.objects.push(shape);
  }

  render(camera, distance) {
    this.objects.forEach((object) => {
      object.render(camera, distance);
    });
  }

  rotateX(angle) {
    let rotationX = math.matrix([
      [1, 0, 0, 0],
      [0, cos(angle), -sin(angle), 0],
      [0, sin(angle), cos(angle), 0],
      [0, 0, 0, 1],
    ]);

    this.transform = math.multiply(this.transform, rotationX);
  }

  rotateY(angle) {
    let rotationY = math.matrix([
      [cos(angle), 0, -sin(angle), 0],
      [0, 1, 0, 0],
      [sin(angle), 0, cos(angle), 0],
      [0, 0, 0, 1],
    ]);

    this.transform = math.multiply(this.transform, rotationY);
  }

  rotateZ(angle) {
    let rotationZ = math.matrix([
      [cos(angle), -sin(angle), 0, 0],
      [sin(angle), cos(angle), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);

    this.transform = math.multiply(this.transform, rotationZ);
  }
}
