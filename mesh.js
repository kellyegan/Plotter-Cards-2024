class Mesh {
  vertices;
  edges;
  transform;

  constructor() {
    this.vertices = [];
    this.edges = [];
    this.transform = math.identity(4, 4);
  }

  reset() {
    this.transform = math.identity(4, 4);
  }

  copy() {
    const copy = new Mesh();
    copy.transform = math.multiply(math.identity(4, 4), this.transform);
    this.vertices.forEach((v) => copy.vertices.push(v));
    this.edges.forEach((e) => copy.edges.push(e));
    copy.edges = this.edges;

    return copy;
  }

  addTransformation(transformation) {
    this.transform = math.multiply(this.transform, transformation);
  }

  applyTransform() {
    return this.vertices.map((v) => {
      return math.multiply(this.transform, v);
    });
  }

  drawEdge(edge, projectedVerts) {
    const a = projectedVerts[edge[0]];
    const b = projectedVerts[edge[1]];
    line(a.get([0]), a.get([1]), b.get([0]), b.get([1]));
  }

  drawVertex(vertex, label = "") {
    const x = vertex.get([0]);
    const y = vertex.get([1]);
    push();
    text(label, x + 5, y + 10);
    strokeWeight(5);
    point(x, y);
    pop();
  }

  render(camera, renderVertices = false, renderEdges = true) {
    const projectedVerts = camera.project(this.applyTransform());

    if (renderEdges) {
      //Draw edges between projected vertices
      this.edges.forEach((edge) => {
        this.drawEdge(edge, projectedVerts);
      });
    }
    if (renderVertices) {
      projectedVerts.forEach((vertex, i) => {
        this.drawVertex(vertex, i);
      });
    }
  }
}

/**
 * Base camera class for rendering shapes to 2D.
 */
class Camera {
  transform;

  constructor(x = 0, y = 0, z = -1) {
    this.transform = math.matrix([x, y, z, 1]);
  }

  project(vertices) {
    return vertices;
  }
}

class WeakPerspectiveCamera extends Camera {
  focalLength;

  constructor(x = 0, y = 0, z = 0, f = 2) {
    super(x, y, z);
    this.focalLength = f;
  }

  project(vertices) {
    const projectedVertices = vertices
      // Make vertices relative to camera
      .map((p) => {
        return math.add(p, this.transform);
      })
      // Apply weak perspective matrix
      .map((v) => {
        let zScale = this.focalLength / v.get([2]);
        let perspectiveProjection = math.matrix([
          [zScale, 0, 0, 0],
          [0, zScale, 0, 0],
        ]);

        return math.multiply(perspectiveProjection, v);
      })
      // Scale up projection
      .map((v) => {
        return math.multiply(v, width * 0.25);
      });

    return projectedVertices;
  }
}

class OrthoCamera extends Camera {
  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z);
  }

  project(vertices) {
    const orthographicProjection = math.matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ]);

    // Apply orthographic projection
    const projectedVerts = vertices
      .map((p) => {
        return math.multiply(orthographicProjection, p);
      })
      // Scale up projection
      .map((v) => {
        return math.multiply(v, width * 0.25);
      });

    return projectedVerts;
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

  reset() {
    this.objects = [];
    this.transform = math.identity(4, 4);
  }

  add(shape) {
    const newShape = shape.copy();
    newShape.addTransformation(this.transform);
    this.objects.push(newShape);
  }

  render(camera, renderVertices = false, renderEdges = true) {
    this.objects.forEach((object) => {
      object.render(camera, renderVertices, renderEdges);
    });
  }

  translate(x, y, z) {
    let translation = math.matrix([
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1],
    ]);

    this.transform = math.multiply(this.transform, translation);
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

  scale(x, y, z) {
    let translation = math.matrix([
      [x, 0, 0, 0],
      [0, y, 0, 0],
      [0, 0, z, 0],
      [0, 0, 0, 1],
    ]);
  }
}

/**
 * Polyline object made up of multiple line segments in a chain
 */
class Polyline extends Mesh {
  add(x, y, z) {
    this.vertices.push([x, y, z, 1]);
    if (this.vertices.length > 1) {
      this.edges.push([this.vertices.length - 2, this.vertices.length - 1]);
    }
  }
}

/************ PRIMITIVES ************/

/**
 * Tetrahedron primitive
 */
class Tetrahedron extends Mesh {
  size;

  constructor(size) {
    super();

    this.size = size;

    // Generate vertices
    this.vertices = [
      [size / 2, size / 2, size / 2, 1],
      [size / 2, -size / 2, -size / 2, 1],
      [-size / 2, size / 2, -size / 2, 1],
      [-size / 2, -size / 2, size / 2, 1],
    ];

    //Generate edges
    this.edges = [
      [0, 1],
      [1, 2],
      [2, 0],
      [3, 0],
      [3, 1],
      [3, 2],
    ];
  }
}

/**
 * Octahedron primitive
 */
class Octahedron extends Mesh {
  size;

  constructor(size) {
    super();

    this.size = size;

    // Generate vertices
    this.vertices = [
      [size / 2, 0, 0, 1],
      [0, size / 2, 0, 1],
      [0, 0, size / 2, 1],
      [0, -size / 2, 0, 1],
      [0, 0, -size / 2, 1],
      [-size / 2, 0, 0, 1],
    ];

    //Generate edges
    this.edges = [
      [0, 1],
      [0, 2],
      [0, 4],
      [0, 3],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
      [5, 1],
      [5, 2],
      [5, 4],
      [5, 3],
    ];
  }
}

/**
 * Cube primative
 */
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

/**
 * Icosahedron primitive
 */
class Icosahedron extends Mesh {
  size;

  constructor(size) {
    super();

    const halfsize = size / 2;
    const halfphi = halfsize * math.phi;

    // Generate vertices
    this.vertices = [
      [0, halfsize, halfphi, 1],
      [0, -halfsize, halfphi, 1],
      [halfphi, 0, halfsize, 1],
      [halfsize, halfphi, 0, 1],
      [-halfsize, halfphi, 0, 1],
      [-halfphi, 0, halfsize, 1],
      [0, -halfsize, -halfphi, 1],
      [0, halfsize, -halfphi, 1],
      [halfphi, 0, -halfsize, 1],
      [halfsize, -halfphi, 0, 1],
      [-halfsize, -halfphi, 0, 1],
      [-halfphi, 0, -halfsize, 1],
    ];

    this.edges = [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 0],
      [4, 5],
      [5, 0],
      [5, 1],
      [6, 7],
      [7, 8],
      [8, 6],
      [8, 9],
      [9, 6],
      [9, 10],
      [10, 6],
      [10, 11],
      [11, 6],
      [11, 7],
      [1, 9],
      [9, 1],
      [1, 10],
      [10, 5],
      [5, 11],
      [4, 11],
      [4, 7],
      [7, 3],
      [2, 9],
      [2, 8],
      [3, 8],
    ];
  }
}

class Dodecahedron extends Mesh {
  size;

  constructor(size) {
    super();

    this.size = size;
    const s = size / 2;
    const p = s * math.phi;
    const i = s / math.phi;

    // Generate vertices
    this.vertices = [
      [s, s, s, 1],
      [s, s, -s, 1],
      [s, -s, s, 1],
      [s, -s, -s, 1],
      [-s, s, s, 1],
      [-s, s, -s, 1],
      [-s, -s, s, 1],
      [-s, -s, -s, 1],
      [0, i, p, 1],
      [0, i, -p, 1],
      [0, -i, p, 1],
      [0, -i, -p, 1],
      [i, p, 0, 1],
      [i, -p, 0, 1],
      [-i, p, 0, 1],
      [-i, -p, 0, 1],
      [p, 0, i, 1],
      [p, 0, -i, 1],
      [-p, 0, i, 1],
      [-p, 0, -i, 1],
    ];

    //Generate edges
    this.edges = [
      [0, 8],
      [8, 10],
      [10, 2],
      [2, 16],
      [16, 0],
      [0, 12],
      [12, 1],
      [1, 17],
      [17, 16],
      [12, 14],
      [14, 4],
      [4, 8],
      [10, 6],
      [6, 18],
      [18, 4],
      [2, 13],
      [13, 15],
      [15, 6],
      [17, 3],
      [3, 13],
      [15, 7],
      [7, 19],
      [19, 18],
      [3, 11],
      [11, 7],
      [14, 5],
      [5, 19],
      [1, 9],
      [9, 11],
      [5, 9],
    ];
  }
}

/** Evaluate if values are appoximately equal */
function equalish(a, b, epsilon = 0.00001) {
  return abs(a - b) < epsilon;
}

function vertexString(vertex, decimals = 5) {
  let s = `x${vertex.x.toFixed(decimals)}`;
  s += `y${vertex.y.toFixed(decimals)}`;
  s += `z${vertex.z.toFixed(decimals)}`;

  return s;
}

function createMeshFromModel(model) {
  const uniqueVerts = new Map();
  const vertRef = new Map();

  const mesh = new Mesh();

  let vertexCount = 0;
  model.vertices.forEach((vertex, i) => {
    const vertString = vertexString(vertex);
    if (!uniqueVerts.has(vertString)) {
      uniqueVerts.set(vertString, {
        index: vertexCount,
        x: vertex.x,
        y: vertex.y,
        z: vertex.z,
      });
      vertexCount++;
    }
    vertRef.set(i, uniqueVerts.get(vertString).index);
  });

  uniqueVerts.forEach((v) => {
    mesh.vertices[v.index] = [v.x, v.y, v.z, 1];
  });

  const uniqueEdges = [];

  model.faces.forEach((face) => {
    for (let i = 0; i < face.length; i++) {
      let a = vertRef.get(face[i]);
      let b = vertRef.get(face[(i + 1) % face.length]);

      // Order edge vertices
      if (a > b) {
        let s = a;
        a = b;
        b = s;
      }

      let edgeString = `${a}->${b}`;

      // Check if edge is already included
      if (!uniqueEdges.includes(edgeString)) {
        uniqueEdges.push(edgeString);
        mesh.edges.push([a, b]);
      }
    }
  });
  console.log(mesh.edges);
  return mesh;
}
