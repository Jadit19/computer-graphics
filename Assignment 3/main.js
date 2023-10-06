const skyboxVsCode = `
attribute vec3 aVertexPosition;
uniform mat4 uPMatrix;
uniform mat4 uMVMatrix; 
varying vec3 vPosition;
void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vPosition= aVertexPosition;   
}`
const skyboxFsCode = `
precision mediump float;
uniform samplerCube uEnv;
varying vec3 vPosition;
void main() {
  gl_FragColor = textureCube(uEnv, normalize(vPosition));
}`

/** @type {Canvas} */
var canvas

/** @type {Skybox} */
var skybox

function degToRad (d) {
  return (d * Math.PI) / 180
}

var X_AXIS = [1.0, 0.0, 0.0]
var Y_AXIS = [0.0, 1.0, 0.0]
var Z_AXIS = [0.0, 0.0, 1.0]

const FOV = 50
var VIEW_RADIUS = 2
var viewOrigin = [VIEW_RADIUS, 0.0, 0.0]
var viewAngle = 0
var viewAngleStep = degToRad(0.2)

var viewUp = [0.0, 1.0, 0.0]
var viewLookAt = vec3.create()
var viewCenter = vec3.create()

var pMatrix = mat4.create()
var mvMatrix = mat4.create()

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
      this.gl.enable(this.gl.CULL_FACE)
      this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
    } catch (e) {
      console.log(e)
    } finally {
      if (!this.gl) {
        alert('[ERROR] WebGL initialization failed!')
      }
      return
    }
  }

  clear () {
    this.gl.viewport(0, 0, 800, 800)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }
}

class Shader {
  constructor (vsSource, fsSource) {
    this.vsSource = vsSource
    this.fsSource = fsSource

    this.init()
  }

  init () {
    this.program = canvas.gl.createProgram()
    this.setupVertexShader()
    this.setupFragmentShader()

    canvas.gl.linkProgram(this.program)
    if (!canvas.gl.getProgramParameter(this.program, canvas.gl.LINK_STATUS)) {
      console.error(canvas.gl.getShaderInfoLog())
    }
  }

  setupVertexShader () {
    this.vertex = canvas.gl.createShader(canvas.gl.VERTEX_SHADER)
    canvas.gl.shaderSource(this.vertex, this.vsSource)
    canvas.gl.compileShader(this.vertex)
    if (!canvas.gl.getShaderParameter(this.vertex, canvas.gl.COMPILE_STATUS)) {
      alert('[ERROR] Vertex shader not compiled!')
      console.error(canvas.gl.getShaderInfoLog(this.vertex))
    }
    canvas.gl.attachShader(this.program, this.vertex)
  }

  setupFragmentShader () {
    this.fragment = canvas.gl.createShader(canvas.gl.FRAGMENT_SHADER)
    canvas.gl.shaderSource(this.fragment, this.fsSource)
    canvas.gl.compileShader(this.fragment)
    if (
      !canvas.gl.getShaderParameter(this.fragment, canvas.gl.COMPILE_STATUS)
    ) {
      alert('[ERROR] Fragment shader not compiled!')
      console.error(canvas.gl.getShaderInfoLog(this.fragment))
    }
    canvas.gl.attachShader(this.program, this.fragment)
  }
}

class Skybox {
  constructor (folderPath) {
    this.folderPath = folderPath
    this.size = 3.0

    this.init()
  }

  init () {
    this.initShape()
    this.initTexture()
    this.initShader()
    this.initBuffer()
  }

  initShape () {
    this.positionArray = []
    var sizes = [-this.size, this.size]
    for (var z in sizes) {
      for (var y in sizes) {
        for (var x in sizes) {
          this.positionArray.push(sizes[x])
          this.positionArray.push(sizes[y])
          this.positionArray.push(sizes[z])
        }
      }
    }

    this.indexArray = [
      //
      0, 1, 2, 2, 1, 3,
      //
      4, 6, 5, 6, 7, 5,
      //
      0, 4, 1, 4, 5, 1,
      //
      2, 3, 6, 6, 3, 7,
      //
      0, 2, 4, 2, 6, 4,
      //
      1, 5, 3, 3, 5, 7
    ]
  }

  initTexture () {
    this.texture = canvas.gl.createTexture()
    canvas.gl.activeTexture(canvas.gl.TEXTURE0)
    canvas.gl.bindTexture(canvas.gl.TEXTURE_CUBE_MAP, this.texture)
    canvas.gl.texParameteri(
      canvas.gl.TEXTURE_CUBE_MAP,
      canvas.gl.TEXTURE_MAG_FILTER,
      canvas.gl.LINEAR
    )
    canvas.gl.texParameteri(
      canvas.gl.TEXTURE_CUBE_MAP,
      canvas.gl.TEXTURE_MIN_FILTER,
      canvas.gl.LINEAR_MIPMAP_LINEAR
    )

    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      this.texture,
      this.folderPath + 'posx.jpg'
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      this.texture,
      this.folderPath + 'negx.jpg'
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      this.texture,
      this.folderPath + 'posy.jpg'
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      this.texture,
      this.folderPath + 'negy.jpg'
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      this.texture,
      this.folderPath + 'posz.jpg'
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      this.texture,
      this.folderPath + 'negz.jpg',
      () => {
        canvas.gl.generateMipmap(canvas.gl.TEXTURE_CUBE_MAP)
      }
    )
  }

  loadCubeMap (target, texture, url, callback) {
    var image = new Image()
    image.src = url
    image.addEventListener('load', () => {
      canvas.gl.activeTexture(canvas.gl.TEXTURE0)
      canvas.gl.texImage2D(
        target,
        0,
        canvas.gl.RGBA,
        canvas.gl.RGBA,
        canvas.gl.UNSIGNED_BYTE,
        image
      )
      if (callback) {
        callback()
      }
    })
  }

  initShader () {
    this.shader = new Shader(skyboxVsCode, skyboxFsCode)

    this.locations = {
      aVertexPosition: canvas.gl.getAttribLocation(
        this.shader.program,
        'aVertexPosition'
      ),
      uPMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uPMatrix'),
      uMVMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uMVMatrix'),
      uEnv: canvas.gl.getUniformLocation(this.shader.program, 'uEnv')
    }
  }

  initBuffer () {
    this.buffer = {
      position: canvas.gl.createBuffer(),
      index: canvas.gl.createBuffer()
    }

    this.buffer.position.itemSize = 3
    this.buffer.position.numItems =
      this.positionArray.length / this.buffer.position.itemSize
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.position)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      new Float32Array(this.positionArray),
      canvas.gl.STATIC_DRAW
    )

    this.buffer.index.itemSize = 1
    this.buffer.index.numItems =
      this.indexArray.length / this.buffer.index.itemSize
    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.buffer.index)
    canvas.gl.bufferData(
      canvas.gl.ELEMENT_ARRAY_BUFFER,
      new Int16Array(this.indexArray),
      canvas.gl.STATIC_DRAW
    )
  }

  draw () {
    canvas.gl.useProgram(this.shader.program)

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.position)
    canvas.gl.enableVertexAttribArray(this.locations.aVertexPosition)
    canvas.gl.vertexAttribPointer(
      this.locations.aVertexPosition,
      this.buffer.position.itemSize,
      canvas.gl.FLOAT,
      false,
      0,
      0
    )

    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.buffer.index)

    canvas.gl.uniformMatrix4fv(this.locations.uPMatrix, false, pMatrix)
    canvas.gl.uniformMatrix4fv(this.locations.uMVMatrix, false, mvMatrix)
    canvas.gl.uniform1i(this.locations.uEnv, 0)

    canvas.gl.activeTexture(canvas.gl.TEXTURE0)
    canvas.gl.bindTexture(canvas.gl.TEXTURE_CUBE_MAP, this.texture)

    canvas.gl.drawElements(
      canvas.gl.TRIANGLES,
      this.buffer.index.numItems,
      canvas.gl.UNSIGNED_SHORT,
      0
    )

    canvas.gl.disableVertexAttribArray(this.locations.aVertexPosition)
  }
}

const updateMatrices = () => {
  viewAngle += viewAngleStep
  viewOrigin = [
    VIEW_RADIUS * Math.cos(viewAngle),
    0.0,
    VIEW_RADIUS * Math.sin(viewAngle)
  ]
  viewLookAt = [-Math.cos(viewAngle), 0.0, -Math.sin(viewAngle)]
  mat4.lookAt(viewOrigin, viewCenter, viewUp, mvMatrix)
}

const initialize = () => {
  canvas = new Canvas('canvas')
  mat4.identity(pMatrix)
  mat4.perspective(
    50,
    canvas.gl.viewportWidth / canvas.gl.viewportHeight,
    0.1,
    1000,
    pMatrix
  )

  skybox = new Skybox('assets/images/')
}

const drawScene = () => {
  requestAnimationFrame(drawScene)
  updateMatrices()

  canvas.clear()
  skybox.draw()
}

const webGLStart = () => {
  initialize()
  drawScene()
}
