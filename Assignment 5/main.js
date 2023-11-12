/** @type {Canvas} */
var canvas

/** @type {Buffer} */
var buffer

/** @type {Shader} */
var shader

class Canvas {
  constructor (id) {
    this.element = document.getElementById(id)

    this.init()
  }

  init () {
    try {
      /** @type {WebGL2RenderingContext} */
      this.gl = this.element.getContext('webgl2')
      this.gl.viewportWidth = this.element.width
      this.gl.viewportHeight = this.element.height
      this.gl.enable(this.gl.DEPTH_TEST)
    } catch (e) {
      console.error(e)
    } finally {
      if (!this.gl) {
        alert('[ERROR] WebGL initialization failed!')
      }
    }
  }

  clear () {
    this.gl.clearColor(0.9, 0.9, 0.9, 1.0)
    this.gl.viewport(0, 0, this.element.width, this.element.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }
}

class Buffer {
  constructor () {
    this.initSphere()
  }

  initSphere () {
    this.sphere = {
      vertices: null,
      vertex: null,
      indices: null,
      index: null,
      normal: null,
      normals: null
    }
    this.initSphereLocations()
    this.initSphereIndices()
  }

  initSphereLocations () {
    const latitudeBands = 30
    const longitudeBands = 30
    const radius = 0.5
    let array = []
    let array2 = []
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
        array2.push(x)
        array2.push(y)
        array2.push(z)
      }
    }

    this.sphere.vertices = new Float32Array(array)
    this.sphere.vertex = canvas.gl.createBuffer()
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.sphere.vertex)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      this.sphere.vertices,
      canvas.gl.STATIC_DRAW
    )
    this.sphere.vertex.itemSize = 3
    this.sphere.vertex.numItems = this.sphere.vertices.length / 3

    this.sphere.normals = new Float32Array(array2)
    this.sphere.normal = canvas.gl.createBuffer()
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.sphere.normal)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      this.sphere.normals,
      canvas.gl.STATIC_DRAW
    )
    this.sphere.normal.itemSize = 3
    this.sphere.vertex.numItems = this.sphere.normals.length / 3
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
    this.sphere.index = canvas.gl.createBuffer()
    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.sphere.index)
    canvas.gl.bufferData(
      canvas.gl.ELEMENT_ARRAY_BUFFER,
      this.sphere.indices,
      canvas.gl.STATIC_DRAW
    )
    this.sphere.index.itemSize = 1
    this.sphere.index.numItems = this.sphere.indices.length
  }
}

class Shader {
  constructor (vertexCode, fragmentCode) {
    this.vertexCode = vertexCode
    this.fragmentCode = fragmentCode

    this.init()
  }

  init () {
    this.program = canvas.gl.createProgram()
    this.setupVertexShader()
    this.setupFragmentShader()
    canvas.gl.linkProgram(this.program)
    if (!canvas.gl.getProgramParameter(this.program, canvas.gl.LINK_STATUS)) {
      console.error(canvas.gl.getProgramInfoLog(this.program))
    }
    this.setupLocations()
    canvas.gl.useProgram(this.program)
  }

  setupVertexShader () {
    this.vertex = canvas.gl.createShader(canvas.gl.VERTEX_SHADER)
    canvas.gl.shaderSource(this.vertex, this.vertexCode)
    canvas.gl.compileShader(this.vertex)
    if (!canvas.gl.getShaderParameter(this.vertex, canvas.gl.COMPILE_STATUS)) {
      alert('[ERROR] Vertex shader not compiled!')
      console.error(canvas.gl.getShaderInfoLog(this.vertex))
    }
    canvas.gl.attachShader(this.program, this.vertex)
  }

  setupFragmentShader () {
    this.fragment = canvas.gl.createShader(canvas.gl.FRAGMENT_SHADER)
    canvas.gl.shaderSource(this.fragment, this.fragmentCode)
    canvas.gl.compileShader(this.fragment)
    if (
      !canvas.gl.getShaderParameter(this.fragment, canvas.gl.COMPILE_STATUS)
    ) {
      alert('[ERROR] Fragment shader not compiled!')
      console.error(canvas.gl.getShaderInfoLog(this.fragment))
    }
    canvas.gl.attachShader(this.program, this.fragment)
  }

  setupLocations () {
    this.locations = {}
  }
}

const initialize = () => {
  canvas = new Canvas('canvas')
  buffer = new Buffer()
}

const drawScene = () => {
  canvas.clear()
}

const webGLStart = () => {
  initialize()
  drawScene()
}
