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
const teapotVsCode = `#version 300 es
in vec3 aNormal;
in vec3 aPosition;

uniform mat4 uMMatrix;
uniform mat4 uPMatrix;
uniform mat4 uVMatrix;

out vec3 vModelPosition;
out vec3 vModelNormal;
out vec3 vWorldPosition;
out vec3 vWorldNormal;
out vec3 vVertexColor;

void main() {
  vModelPosition = aPosition;
  vModelNormal = aNormal;

  vec4 worldPosition = uMMatrix * vec4(aPosition, 1.0);
  vWorldPosition = vec3(worldPosition);
  vWorldNormal = normalize(mat3(uMMatrix) * aNormal);
  vVertexColor = vec3(0.8, 0.8, 0.8);
  
  gl_Position = uPMatrix * uVMatrix * worldPosition;
}`
const teapotFsCode = `#version 300 es
precision mediump float;

const float shininess = 1000.0;
const float PI = 3.1415926535897932384626433832795;

in vec3 vModelPosition;
in vec3 vModelNormal;
in vec3 vWorldPosition;
in vec3 vWorldNormal;
in vec3 vVertexColor;

out vec4 fragColor;

uniform vec3 uViewOrigin;
uniform vec3 uLightDirection;
uniform vec3 uAmbientLight;
uniform vec3 uDiffuseLight;
uniform vec3 uSpecularLight;

uniform samplerCube uEnv;

void main() {
  vec3 worldPosition = vWorldPosition;
  vec3 worldNormal = normalize(vWorldNormal);
  vec3 modelPosition = vModelPosition;

  modelPosition.y -= 1.0;
  modelPosition = normalize(modelPosition);
  vec3 modelNormal = normalize(vModelNormal);

  vec2 textureCoord;
  textureCoord.s = -atan(-modelPosition.z, -modelPosition.x) / 2.0 / PI + 0.5;
  textureCoord.t = 0.5 - 0.5 * modelPosition.y;

  vec3 tangentBAxis = vec3(0.0,1.0,0.0);
  tangentBAxis = normalize(tangentBAxis - dot(tangentBAxis, worldNormal) * worldNormal);
  vec3 tangentTAxis = normalize(cross(tangentBAxis, worldNormal));

  vec3 normalizedLightDirection = normalize(uLightDirection);
  vec3 vectorReflection = normalize(reflect(-normalizedLightDirection, worldNormal));
  vec3 vectorView = normalize(uViewOrigin - worldPosition);

  float diffuseLightWeighting = max( dot(worldNormal, normalizedLightDirection), 0.0 );
  float specularLightWeighting = pow( max( dot(vectorReflection, vectorView), 0.0), shininess );

  fragColor = vec4(
    ( uAmbientLight * vVertexColor)
    + ((uDiffuseLight * vVertexColor) * diffuseLightWeighting)
    + ( uSpecularLight * specularLightWeighting),
    1.0 );
  fragColor += vec4(texture(uEnv, normalize(reflect(-vectorView, worldNormal))).rgb, 0.0);
}`
const sphereVsCode = `#version 300 es
in vec3 aNormal;
in vec3 aPosition;

uniform mat4 uMMatrix;
uniform mat4 uPMatrix;
uniform mat4 uVMatrix;

out vec3 vModelPosition;
out vec3 vModelNormal;
out vec3 vWorldPosition;
out vec3 vWorldNormal;

void main() {
  vModelPosition = aPosition;
  vModelNormal = aNormal;

  vec4 worldPosition = uMMatrix * vec4(aPosition, 1.0);

  vWorldPosition = vec3(worldPosition);
  vWorldNormal = normalize(mat3(uMMatrix) * aNormal);

  gl_Position = uPMatrix * uVMatrix * worldPosition;
}`
const sphereFsCode = `#version 300 es
precision mediump float;

const float shininess = 1000.0;
const float PI = 3.1415926535897932384626433832795;

in vec3 vModelPosition;
in vec3 vModelNormal;
in vec3 vWorldPosition;
in vec3 vWorldNormal;
uniform vec3 vVertexColor;

out vec4 fragColor;

uniform vec3 uViewOrigin;
uniform vec3 uLightDirection;
uniform vec3 uAmbientLight;
uniform vec3 uDiffuseLight;
uniform vec3 uSpecularLight;

uniform samplerCube uEnv;

void main() {
  vec3 worldPosition = vWorldPosition;
  vec3 worldNormal = normalize(vWorldNormal);
  vec3 modelPosition = vModelPosition;

  modelPosition.y -= 1.0;
  modelPosition = normalize(modelPosition);
  vec3 modelNormal = normalize(vModelNormal);

  vec2 textureCoord;
  textureCoord.s = -atan(-modelPosition.z, -modelPosition.x) / 2.0 / PI + 0.5;
  textureCoord.t = 0.5 - 0.5 * modelPosition.y;

  vec3 tangentBAxis = vec3(0.0,1.0,0.0);
  tangentBAxis = normalize(tangentBAxis - dot(tangentBAxis, worldNormal) * worldNormal);
  vec3 tangentTAxis = normalize(cross(tangentBAxis, worldNormal));

  vec3 normalizedLightDirection = normalize(uLightDirection);
  vec3 vectorReflection = normalize(reflect(-normalizedLightDirection, worldNormal));
  vec3 vectorView = normalize(uViewOrigin - worldPosition);

  float diffuseLightWeighting = max( dot(worldNormal, normalizedLightDirection), 0.0 );
  float specularLightWeighting = pow( max( dot(vectorReflection, vectorView), 0.0), shininess );

  fragColor = vec4(
    (8.0 * uAmbientLight * vVertexColor)
    + ((uDiffuseLight * vVertexColor) * diffuseLightWeighting)
    + ( uSpecularLight * specularLightWeighting),
    1.0 );
  fragColor += 0.4 * vec4(texture(uEnv, normalize(reflect(-vectorView, worldNormal))).rgb, 0.0);
}`

/** @type {Canvas} */
var canvas

/** @type {Skybox} */
var skybox

/** @type {Teapot} */
var teapot

/** @type {Sphere} */
var sphere1, sphere2

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

var lightDirection = [-Math.cos(degToRad(40)), Math.sin(degToRad(40)), 0.0]
var ambientLight = [0.08, 0.08, 0.08]
var diffuseLight = [(0.2 * 253) / 255, (0.2 * 184) / 255, (0.2 * 19) / 255]
var specularLight = [(1.0 * 253) / 255, (1.0 * 184) / 255, (1.0 * 19) / 255]

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
      console.error(e)
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

class Teapot {
  constructor (jsonPath) {
    this.jsonPath = jsonPath

    this.init()
  }

  init () {
    this.initShape()
    this.initShader()
    this.initBuffer()
    this.initMatrices()
  }

  initShape () {
    this.positionArray = []
    this.indexArray = []
    this.normalArray = []

    var request = new XMLHttpRequest()
    request.open('GET', this.jsonPath, false)
    request.overrideMimeType('application/json')
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        var mesh = JSON.parse(request.responseText)
        this.positionArray = mesh.vertexPositions
        this.indexArray = mesh.indices
        this.normalArray = mesh.vertexNormals
      }
    }
    request.send()
  }

  initShader () {
    this.shader = new Shader(teapotVsCode, teapotFsCode)

    this.locations = {
      aPosition: canvas.gl.getAttribLocation(this.shader.program, 'aPosition'),
      aNormal: canvas.gl.getAttribLocation(this.shader.program, 'aNormal'),
      uMMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uMMatrix'),
      uVMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uVMatrix'),
      uPMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uPMatrix'),
      uViewOrigin: canvas.gl.getUniformLocation(
        this.shader.program,
        'uViewOrigin'
      ),
      uLightDirection: canvas.gl.getUniformLocation(
        this.shader.program,
        'uLightDirection'
      ),
      uAmbientLight: canvas.gl.getUniformLocation(
        this.shader.program,
        'uAmbientLight'
      ),
      uDiffuseLight: canvas.gl.getUniformLocation(
        this.shader.program,
        'uDiffuseLight'
      ),
      uSpecularLight: canvas.gl.getUniformLocation(
        this.shader.program,
        'uSpecularLight'
      ),
      uEnv: canvas.gl.getUniformLocation(this.shader.program, 'uEnv')
    }
  }

  initBuffer () {
    this.buffer = {
      position: canvas.gl.createBuffer(),
      index: canvas.gl.createBuffer(),
      normal: canvas.gl.createBuffer()
    }

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.position)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      new Float32Array(this.positionArray),
      canvas.gl.STATIC_DRAW
    )
    this.buffer.position.itemSize = 3
    this.buffer.position.numItems =
      this.positionArray.length / this.buffer.position.itemSize

    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.buffer.index)
    canvas.gl.bufferData(
      canvas.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.indexArray),
      canvas.gl.STATIC_DRAW
    )
    this.buffer.index.itemSize = 1
    this.buffer.index.numItems = this.indexArray.length

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.normal)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      new Float32Array(this.normalArray),
      canvas.gl.STATIC_DRAW
    )
    this.buffer.normal.itemSize = 3
    this.buffer.normal.numItems =
      this.normalArray.length / this.buffer.normal.itemSize
  }

  initMatrices () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)
    mat4.scale(this.mMatrix, [0.02, 0.02, 0.02])
  }

  draw () {
    canvas.gl.useProgram(this.shader.program)

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.position)
    canvas.gl.enableVertexAttribArray(this.locations.aPosition)
    canvas.gl.vertexAttribPointer(
      this.locations.aPosition,
      this.buffer.position.itemSize,
      canvas.gl.FLOAT,
      false,
      0,
      0
    )

    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.buffer.index)

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.normal)
    canvas.gl.enableVertexAttribArray(this.locations.aNormal)
    canvas.gl.vertexAttribPointer(
      this.locations.aNormal,
      this.buffer.normal.itemSize,
      canvas.gl.FLOAT,
      false,
      0,
      0
    )

    canvas.gl.uniformMatrix4fv(this.locations.uMMatrix, false, this.mMatrix)
    canvas.gl.uniformMatrix4fv(this.locations.uVMatrix, false, mvMatrix)
    canvas.gl.uniformMatrix4fv(this.locations.uPMatrix, false, pMatrix)
    canvas.gl.uniform3fv(this.locations.uViewOrigin, viewOrigin)
    canvas.gl.uniform1i(this.locations.uEnv, 0)

    canvas.gl.uniform3fv(this.locations.uLightDirection, lightDirection)
    canvas.gl.uniform3fv(this.locations.uAmbientLight, ambientLight)
    canvas.gl.uniform3fv(this.locations.uDiffuseLight, diffuseLight)
    canvas.gl.uniform3fv(this.locations.uSpecularLight, specularLight)

    canvas.gl.drawElements(
      canvas.gl.TRIANGLES,
      this.buffer.index.numItems,
      canvas.gl.UNSIGNED_SHORT,
      0
    )

    canvas.gl.disableVertexAttribArray(this.locations.aPosition)
    canvas.gl.disableVertexAttribArray(this.locations.aNormal)
  }
}

class Sphere {
  constructor (color, number) {
    this.color = [color[0] / 255, color[1] / 255, color[2] / 255]
    this.number = number

    this.init()
  }

  init () {
    this.initShape()
    this.initShader()
    this.initBuffer()
    this.initMatrices()
  }

  initShape () {
    this.positionArray = []
    this.indexArray = []
    this.normalArray = []

    var nSlices = 50
    var nStacks = 50
    var radius = 1.0
    for (var i = 0; i <= nSlices; i++) {
      var angle = (i * Math.PI) / nSlices
      var comp1 = Math.sin(angle)
      var comp2 = Math.cos(angle)

      for (var j = 0; j <= nStacks; j++) {
        var phi = (j * 2 * Math.PI) / nStacks
        var comp3 = Math.sin(phi)
        var comp4 = Math.cos(phi)

        var xcood = comp4 * comp1
        var ycoord = comp2
        var zcoord = comp3 * comp1

        this.positionArray.push(
          -radius * xcood,
          -radius * ycoord,
          -radius * zcoord
        )
        this.normalArray.push(xcood, ycoord, zcoord)
      }
    }

    for (var i = 0; i < nSlices; i++) {
      for (var j = 0; j < nStacks; j++) {
        var id1 = i * (nStacks + 1) + j
        var id2 = id1 + nStacks + 1

        this.indexArray.push(id1, id2, id1 + 1)
        this.indexArray.push(id2, id2 + 1, id1 + 1)
      }
    }
  }

  initShader () {
    this.shader = new Shader(sphereVsCode, sphereFsCode)

    this.locations = {
      aPosition: canvas.gl.getAttribLocation(this.shader.program, 'aPosition'),
      aNormal: canvas.gl.getAttribLocation(this.shader.program, 'aNormal'),
      uMMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uMMatrix'),
      uVMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uVMatrix'),
      uPMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uPMatrix'),
      uViewOrigin: canvas.gl.getUniformLocation(
        this.shader.program,
        'uViewOrigin'
      ),
      uLightDirection: canvas.gl.getUniformLocation(
        this.shader.program,
        'uLightDirection'
      ),
      uAmbientLight: canvas.gl.getUniformLocation(
        this.shader.program,
        'uAmbientLight'
      ),
      uDiffuseLight: canvas.gl.getUniformLocation(
        this.shader.program,
        'uDiffuseLight'
      ),
      uSpecularLight: canvas.gl.getUniformLocation(
        this.shader.program,
        'uSpecularLight'
      ),
      uEnv: canvas.gl.getUniformLocation(this.shader.program, 'uEnv'),
      vVertexColor: canvas.gl.getUniformLocation(
        this.shader.program,
        'vVertexColor'
      )
    }
  }

  initBuffer () {
    this.buffer = {
      position: canvas.gl.createBuffer(),
      index: canvas.gl.createBuffer(),
      normal: canvas.gl.createBuffer()
    }

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.position)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      new Float32Array(this.positionArray),
      canvas.gl.STATIC_DRAW
    )
    this.buffer.position.itemSize = 3
    this.buffer.position.numItems =
      this.positionArray.length / this.buffer.position.itemSize

    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.buffer.index)
    canvas.gl.bufferData(
      canvas.gl.ELEMENT_ARRAY_BUFFER,
      new Uint32Array(this.indexArray),
      canvas.gl.STATIC_DRAW
    )
    this.buffer.index.itemSize = 1
    this.buffer.index.numItems = this.indexArray.length

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.normal)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      new Float32Array(this.normalArray),
      canvas.gl.STATIC_DRAW
    )
    this.buffer.normal.itemSize = 3
    this.buffer.normal.numItems =
      this.normalArray.length / this.buffer.normal.itemSize
  }

  initMatrices () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)

    if (this.number === 1) {
      this.mMatrix = mat4.translate(this.mMatrix, [0, -0.06, 0.35])
      mat4.scale(this.mMatrix, [0.1, 0.1, 0.1])
    } else {
      this.mMatrix = mat4.translate(this.mMatrix, [0.2, -0.1, 0.2])
      mat4.scale(this.mMatrix, [0.05, 0.05, 0.05])
    }
  }

  draw () {
    canvas.gl.useProgram(this.shader.program)

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.position)
    canvas.gl.enableVertexAttribArray(this.locations.aPosition)
    canvas.gl.vertexAttribPointer(
      this.locations.aPosition,
      this.buffer.position.itemSize,
      canvas.gl.FLOAT,
      false,
      0,
      0
    )

    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.buffer.index)

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.normal)
    canvas.gl.enableVertexAttribArray(this.locations.aNormal)
    canvas.gl.vertexAttribPointer(
      this.locations.aNormal,
      this.buffer.normal.itemSize,
      canvas.gl.FLOAT,
      false,
      0,
      0
    )

    canvas.gl.uniformMatrix4fv(this.locations.uMMatrix, false, this.mMatrix)
    canvas.gl.uniformMatrix4fv(this.locations.uVMatrix, false, mvMatrix)
    canvas.gl.uniformMatrix4fv(this.locations.uPMatrix, false, pMatrix)
    canvas.gl.uniform3fv(this.locations.uViewOrigin, viewOrigin)
    canvas.gl.uniform1i(this.locations.uEnv, 0)

    canvas.gl.uniform3fv(this.locations.uLightDirection, lightDirection)
    canvas.gl.uniform3fv(this.locations.uAmbientLight, ambientLight)
    canvas.gl.uniform3fv(this.locations.uDiffuseLight, diffuseLight)
    canvas.gl.uniform3fv(this.locations.uSpecularLight, specularLight)
    canvas.gl.uniform3fv(this.locations.vVertexColor, this.color)

    canvas.gl.drawElements(
      canvas.gl.TRIANGLES,
      this.buffer.index.numItems,
      canvas.gl.UNSIGNED_INT,
      0
    )

    canvas.gl.disableVertexAttribArray(this.locations.aPosition)
    canvas.gl.disableVertexAttribArray(this.locations.aNormal)
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
  teapot = new Teapot('assets/meshes/teapot.json')
  sphere1 = new Sphere([32, 82, 64], 1)
  sphere2 = new Sphere([52, 66, 125], 2)
}

const drawScene = () => {
  requestAnimationFrame(drawScene)
  updateMatrices()

  canvas.clear()
  skybox.draw()
  teapot.draw()
  sphere1.draw()
  sphere2.draw()
}

const webGLStart = () => {
  initialize()
  drawScene()
}
