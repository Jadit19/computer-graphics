const shaderCode = {
  vertex: `#version 330 es
    in vec3 aPosition;
    out vec3 vPosition;
    void main() {
      vPosition = aPosition;
      gl_Position = vec4(aPosition, 1.0);
    }
  `,
  fragment: `#version 330 es
    precision mediump float;
    in vec3 vPosition;
    out vec4 fragColor;
    void main() {
      fragColor = vec4(aPosition,  0);
    }
  `
}

/** @type {Canvas} */
var canvas

/** @type {Inputs} */
var inputs

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

class Inputs {
  constructor () {
    this.setupMode()
    this.setupLight()
    this.setupBounces()
  }

  setupMode () {
    this.mode = 0.0
    document.getElementById('mode-none').addEventListener('click', () => {
      this.mode = 0.0
    })
    document.getElementById('mode-shadow').addEventListener('click', () => {
      this.mode = 1.0
    })
    document.getElementById('mode-reflection').addEventListener('click', () => {
      this.mode = 2.0
    })
    document.getElementById('mode-both').addEventListener('click', () => {
      this.mode = 3.0
    })
  }

  setupLight () {
    this.light = 0.0
    document.getElementById('light').addEventListener('input', e => {
      this.light = e.target.value
    })
  }

  setupBounces () {
    this.bounces = 1
    document.getElementById('bounces').addEventListener('input', e => {
      this.bounces = e.target.value
    })
  }
}

class Scene {
  constructor () {
    this.init()
  }

  init () {
    this.shader = new Shader(shaderCode.vertex, shaderCode.fragment)
  }
}

const initialize = () => {
  canvas = new Canvas('canvas')
  inputs = new Inputs()
}

const drawScene = () => {
  canvas.clear()
}

const webGLStart = () => {
  initialize()
  drawScene()
}
