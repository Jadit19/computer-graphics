class Buffer {
  constructor (gl) {
    /** @type {WebGLRenderingContext} */
    this.gl = gl
    this.initCube()
    this.initSphere()
  }

  initCube () {
    this.cube = {
      vertices: null,
      vertex: null,
      indices: null,
      index: null
    }
    this.initCubeLocations()
    this.initCubeIndices()
  }

  initCubeLocations () {
    this.cube.vertices = new Float32Array([
      -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
      -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
      -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,
      0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
      -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5
    ])
    this.cube.vertex = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cube.vertex)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.cube.vertices,
      this.gl.STATIC_DRAW
    )
    this.cube.vertex.itemSize = 3
    this.cube.vertex.numItems = this.cube.vertices.length
  }

  initCubeIndices () {
    this.cube.indices = new Uint16Array([
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
    ])
    this.cube.index = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cube.index)
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      this.cube.indices,
      this.gl.STATIC_DRAW
    )
    this.cube.index.itemSize = 1
    this.cube.index.numItems = this.cube.indices.length
  }

  initSphere () {
    this.sphere = {
      vertices: null,
      vertex: null,
      indices: null,
      index: null
    }
    this.initSphereLocations()
    this.initSphereIndices()
  }

  initSphereLocations () {
    const latitudeBands = 30
    const longitudeBands = 30
    const radius = 0.5
    let array = []
    for (let i = 0; i <= latitudeBands; i++) {
      const theta = (i * Math.PI) / latitudeBands
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)
      for (let j = 0; j <= longitudeBands; j++) {
        const phi = (j * 2 * Math.PI) / longitudeBands
        const sinPhi = Math.sin(phi)
        const cosPhi = Math.cos(phi)
        const x = cosPhi * sinTheta
        const y = cosTheta
        const z = sinPhi * sinTheta
        array.push(radius * x)
        array.push(radius * y)
        array.push(radius * z)
      }
    }

    this.sphere.vertices = new Float32Array(array)
    this.sphere.vertex = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sphere.vertex)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.sphere.vertices,
      this.gl.STATIC_DRAW
    )
    this.sphere.vertex.itemSize = 3
    this.sphere.vertex.numItems = this.sphere.vertices.length / 3
  }

  initSphereIndices () {
    let array = []
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 30; j++) {
        const first = i * (30 + 1) + j
        const second = first + 30 + 1
        array.push(first)
        array.push(second)
        array.push(first + 1)
        array.push(second)
        array.push(second + 1)
        array.push(first + 1)
      }
    }

    this.sphere.indices = new Uint16Array(array)
    this.sphere.index = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.sphere.index)
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      this.sphere.indices,
      this.gl.STATIC_DRAW
    )
    this.sphere.index.itemSize = 1
    this.sphere.index.numItems = this.sphere.indices.length
  }
}
