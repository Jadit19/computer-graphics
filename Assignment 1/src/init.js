class Init {
  constructor (canvas) {
    this.canvas = canvas
    this.setupGL()
    this.setupShaders()
    this.setupLocations()
  }

  setupGL () {
    try {
      /** @type {WebGLRenderingContext} */
      this.gl = this.canvas.getContext('webgl2')
      this.gl.viewportWidth = this.canvas.width
      this.gl.viewportHeight = this.canvas.height
    } catch (e) {
      console.error(e)
    }
    if (!this.gl) {
      alert('[ERROR] WebGL initialization failed!')
    }
  }

  setupShaders () {
    this.shaderProgram = this.gl.createProgram()
    this.setupVertexShader()
    this.setupFragmentShader()

    this.gl.linkProgram(this.shaderProgram)
    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      console.log(this.gl.getShaderInfoLog(this.vertexShader))
      console.log(this.gl.getShaderInfoLog(this.fragmentShader))
    }

    this.gl.useProgram(this.shaderProgram)
  }

  setupVertexShader () {
    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
    this.vertexShaderCode = `#version 300 es
in vec2 aPosition;
uniform mat4 uMMatrix;

void main() {
  gl_Position = uMMatrix*vec4(aPosition,0.0,1.0);
  gl_PointSize = 10.0;
}`
    this.gl.shaderSource(this.vertexShader, this.vertexShaderCode)
    this.gl.compileShader(this.vertexShader)
    if (
      !this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)
    ) {
      alert('[ERROR] Vertex shader not compiled!')
      console.error(this.gl.getShaderInfoLog(this.vertexShader))
    }
    this.gl.attachShader(this.shaderProgram, this.vertexShader)
  }

  setupFragmentShader () {
    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
    this.fragmentShaderCode = `#version 300 es
precision mediump float;
out vec4 fragColor;
uniform vec4 color;

void main() {
  fragColor = color;
}`
    this.gl.shaderSource(this.fragmentShader, this.fragmentShaderCode)
    this.gl.compileShader(this.fragmentShader)
    if (
      !this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)
    ) {
      alert('[ERROR] Fragment shader not compiled!')
      console.error(this.gl.getShaderInfoLog(this.fragmentShader))
    }
    this.gl.attachShader(this.shaderProgram, this.fragmentShader)
  }

  setupLocations () {
    this.aPositionLocation = this.gl.getAttribLocation(
      this.shaderProgram,
      'aPosition'
    )
    this.uMMatrixLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      'uMMatrix'
    )
    this.uColorLoc = this.gl.getUniformLocation(this.shaderProgram, 'color')
    this.gl.enableVertexAttribArray(this.aPositionLocation)
  }

  clear () {
    this.gl.clearColor(0.9, 0.9, 0.9, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }
}
