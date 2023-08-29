class Buffer {
  constructor (gl) {
    /** @type {WebGLRenderingContext} */
    this.gl = gl
    this.initCube()
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
      // Front face
      -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
      // Back face
      -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
      // Top face
      -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
      // Bottom face
      -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
      // Right face
      0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
      // Left face
      -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5
    ])
    this.cube.vertex = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cube.vertex)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.cube.vertices,
      this.gl.STATIC_DRAW
    )
    this.cube.vertex.itemSize = 3
    this.cube.vertex.numItems = 72
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
    this.cube.index.numItems = 36
  }
}
