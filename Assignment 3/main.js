function degToRad (d) {
  return (d * Math.PI) / 180
}

const globalVars = {
  viewOrigin: [2.0, 1.0, 0.0],
  viewAngle: 0,
  viewAngleStep: degToRad(0.2),
  viewUp: [0.0, 1.0, 0.0],
  viewLookAt: vec3.create(),
  viewCenter: vec3.create(),
  pMatrix: mat4.create(),
  mvMatrix: mat4.create(),
  lightDirection: [-Math.cos(degToRad(40)), Math.sin(degToRad(40)), 0.0],
  ambientLight: [0.08, 0.08, 0.08],
  diffuseLight: [(0.2 * 253) / 255, (0.2 * 184) / 255, (0.2 * 19) / 255],
  specularLight: [(1.0 * 253) / 255, (1.0 * 184) / 255, (1.0 * 19) / 255]
}

const shaders = {
  skybox: {
    vertex: `
      attribute vec3 aVertexPosition;
      uniform mat4 uPMatrix;
      uniform mat4 uMVMatrix; 
      varying vec3 vPosition;
      void main() {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vPosition= aVertexPosition;   
      }`,
    fragment: `
      precision mediump float;
      uniform samplerCube uEnv;
      varying vec3 vPosition;
      void main() {
        gl_FragColor = textureCube(uEnv, normalize(vPosition));
      }`
  },
  teapot: {
    vertex: `#version 300 es
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
      }`,
    fragment: `#version 300 es
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
  },
  sphere: {
    vertex: `#version 300 es
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
      }`,
    fragment: `#version 300 es
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
  },
  rubiksCube: {
    vertex: `
      attribute vec3 aVertexPosition;
      uniform mat4 uPMatrix;
      uniform mat4 uMVMatrix; 
      uniform mat4 uMMatrix;
      varying vec3 vPosition;
      void main() {
        gl_Position = uPMatrix * uMVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
        vPosition= aVertexPosition;   
      }`,
    fragment: `
      precision mediump float;
      uniform samplerCube uEnv;
      varying vec3 vPosition;
      void main() {
        gl_FragColor = textureCube(uEnv, normalize(vPosition));
      }`
  },
  tableTop: {
    vertex: `#version 300 es
      in vec3 aVertexPosition;
      in vec3 aVertexNormal;

      uniform mat4 uPMatrix;
      uniform mat4 uVMatrix;
      uniform mat4 uModelMatrix;

      out vec3 vModelPosition;
      out vec3 vModelNormal;
      out vec3 vWorldPosition;
      out vec3 vWorldNormal;
      out mat4 vModelMatrix;

      void main() {
        vModelPosition = aVertexPosition;
        vModelNormal = aVertexNormal;
        vModelMatrix = uModelMatrix;

        vec4 worldPosition = uModelMatrix * vec4(aVertexPosition, 1.0);

        vWorldPosition = vec3(worldPosition);
        vWorldNormal = normalize(mat3(uModelMatrix) * aVertexNormal);

        gl_Position = uPMatrix * uVMatrix * worldPosition;
      }`,
    fragment: `#version 300 es
      precision mediump float;
      
      const float shininess = 1000.0;
      const float PI = 3.1415926535897932384626433832795;
      
      in vec3 vModelPosition;
      in vec3 vModelNormal;
      in vec3 vWorldPosition;
      in vec3 vWorldNormal;
      in mat4 vModelMatrix;
      uniform vec3 vVertexColor;
      
      out vec4 fragColor;
      
      uniform vec3 uViewOrigin;
      uniform vec3 uLightDirection;
      uniform vec3 uAmbientLight;
      uniform vec3 uDiffuseLight;
      uniform vec3 uSpecularLight;
      
      uniform samplerCube uEnv;
      uniform sampler2D uTextureMap;
      
      void main() {
        vec3 worldPosition = vWorldPosition;
        vec3 worldNormal = normalize(vWorldNormal);
        vec3 modelPosition = vModelPosition;

        modelPosition.y -= 1.0;
        modelPosition = normalize(modelPosition);
        
        vec3 transformedNormal = normalize(mat3(transpose(inverse(vModelMatrix))) * vModelNormal);
        vec3 transformedLightDirection = normalize(mat3(transpose(inverse(vModelMatrix))) * uLightDirection);

        vec2 textureCoord = vec2(0.5, 0.5);
        textureCoord.s = -atan(-modelPosition.z, -modelPosition.x) / 2.0 / PI + 0.5;
        textureCoord.t = 0.5 - 0.5 * modelPosition.y;

        vec3 normalizedLightDirection = normalize(uLightDirection);
        vec3 vectorReflection = normalize( reflect(-normalizedLightDirection, worldNormal) );
        vec3 vectorView = normalize( uViewOrigin - worldPosition );

        float diffuseLightWeighting = max( dot(worldNormal, normalizedLightDirection), 0.0 );
        float specularLightWeighting = pow( max( dot(vectorReflection, vectorView), 0.0), shininess );
      
        fragColor = 0.5* vec4(texture(uTextureMap, textureCoord).rgb, 2.0);
        fragColor += 0.4 * vec4(texture(uEnv, normalize(reflect(-vectorView, transformedNormal))).rgb, 0.0);
      }`
  },
  tableLeg: {
    vertex: `#version 300 es
      in vec3 aVertexPosition;
      in vec3 aVertexNormal;

      uniform mat4 uPMatrix;
      uniform mat4 uMVMatrix;
      uniform mat4 uModelMatrix;

      out vec3 vModelPosition;
      out vec3 vModelNormal;
      out vec3 vWorldPosition;
      out vec3 vWorldNormal;

      void main() {
        vModelPosition = aVertexPosition;
        vModelNormal = aVertexNormal;

        vec4 worldPosition = uModelMatrix * vec4(aVertexPosition, 1.0);

        vWorldPosition = vec3(worldPosition);
        vWorldNormal = normalize(mat3(uModelMatrix) * aVertexNormal);

        gl_Position = uPMatrix * uMVMatrix * worldPosition;
      }`,
    fragment: `#version 300 es
      precision mediump float;

      const float shininess = 1000.0;
      const float PI = 3.1415926535897932384626433832795;

      uniform vec3 uViewOrigin;
      uniform vec3 uLightDirection;
      uniform vec3 uAmbientLight;
      uniform vec3 uDiffuseLight;
      uniform vec3 uSpecularLight;
      uniform sampler2D uTextureMap;

      uniform samplerCube uEnv;
      uniform vec3 vVertexColor;

      in vec3 vModelPosition;
      in vec3 vWorldPosition;
      in vec3 vWorldNormal;

      out vec4 fragColor;
      void main() {
        vec3 worldPosition = vWorldPosition;
        vec3 worldNormal = normalize(vWorldNormal);
        vec3 modelPosition = vModelPosition;

        modelPosition.y -= 1.0;
        modelPosition = normalize(modelPosition);

        vec2 textureCoord = vec2(0.5, 0.5);
        textureCoord.s = -atan(-modelPosition.z, -modelPosition.x) / 2.0 / PI + 0.5;
        textureCoord.t = 0.5 - 0.5 * modelPosition.y;

        vec3 normalizedLightDirection = normalize(uLightDirection);
        vec3 vectorReflection = normalize( reflect(-normalizedLightDirection, worldNormal) );
        vec3 vectorView = normalize( uViewOrigin - worldPosition );

        float diffuseLightWeighting = max( dot(worldNormal, normalizedLightDirection), 0.0 );
        float specularLightWeighting = pow( max( dot(vectorReflection, vectorView), 0.0), shininess );

        fragColor = 0.5* vec4(texture(uTextureMap, textureCoord).rgb, 2.0);
        fragColor += 0.4 * vec4(texture(uEnv, normalize(reflect(-vectorView, worldNormal))).rgb, 0.0);
      }`
  },
  box: {
    vertex: `#version 300 es
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
      }`,
    fragment: `#version 300 es
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
        vec3 vectorReflection = normalize( reflect(-normalizedLightDirection, worldNormal));
        vec3 vectorView = normalize(uViewOrigin - worldPosition);
      
        float diffuseLightWeighting = max( dot(worldNormal, normalizedLightDirection), 0.0 );
        float specularLightWeighting = pow( max( dot(vectorReflection, vectorView), 0.0), shininess );
      
        fragColor = vec4(
          ( uAmbientLight * vVertexColor)
          + ((uDiffuseLight * vVertexColor) * diffuseLightWeighting)
          + ( uSpecularLight * specularLightWeighting),
          1.0 );
        fragColor += vec4(texture(uEnv, normalize(refract(-vectorView, worldNormal, 0.82))).rgb, 0.0);
      }`
  }
}

/** @type {Canvas} */
var canvas

/** @type {Shader} */
var sphereShader, tableLegShader

/** @type {Buffer} */
var buffer

/** @type {Texture} */
var texture

/** @type {Skybox} */
var skybox

/** @type {Teapot} */
var teapot

/** @type {Ball} */
var ball1, ball2

/** @type {RubiksCube} */
var rubiksCube

/** @type {TableTop} */
var tableTop

/** @type {TableLeg} */
var tableLeg1, tableLeg2, tableLeg3, tableLeg4

/** @type {Box} */
var box

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
      this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
    } catch (e) {
      console.error(e)
    } finally {
      if (!this.gl) {
        alert('[ERROR] WebGL initialization failed!')
      }
    }
  }

  clear () {
    this.gl.viewport(0, 0, 800, 800)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }
}

class Shader {
  constructor (source) {
    this.source = source

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
    canvas.gl.shaderSource(this.vertex, this.source.vertex)
    canvas.gl.compileShader(this.vertex)
    if (!canvas.gl.getShaderParameter(this.vertex, canvas.gl.COMPILE_STATUS)) {
      alert('[ERROR] Vertex shader not compiled!')
      console.error(canvas.gl.getShaderInfoLog(this.vertex))
    }
    canvas.gl.attachShader(this.program, this.vertex)
  }

  setupFragmentShader () {
    this.fragment = canvas.gl.createShader(canvas.gl.FRAGMENT_SHADER)
    canvas.gl.shaderSource(this.fragment, this.source.fragment)
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

class Buffer {
  constructor () {
    this.initSphere()
    this.initCube()
  }

  initSphere () {
    this.sphere = {
      position: canvas.gl.createBuffer(),
      index: canvas.gl.createBuffer(),
      normal: canvas.gl.createBuffer()
    }

    let positionArray = []
    let indexArray = []
    let normalArray = []

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

        positionArray.push(-radius * xcood, -radius * ycoord, -radius * zcoord)
        normalArray.push(xcood, ycoord, zcoord)
      }
    }

    for (var i = 0; i < nSlices; i++) {
      for (var j = 0; j < nStacks; j++) {
        var id1 = i * (nStacks + 1) + j
        var id2 = id1 + nStacks + 1

        indexArray.push(id1, id2, id1 + 1)
        indexArray.push(id2, id2 + 1, id1 + 1)
      }
    }

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.sphere.position)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      new Float32Array(positionArray),
      canvas.gl.STATIC_DRAW
    )
    this.sphere.position.itemSize = 3
    this.sphere.position.numItems =
      positionArray.length / this.sphere.position.itemSize

    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.sphere.index)
    canvas.gl.bufferData(
      canvas.gl.ELEMENT_ARRAY_BUFFER,
      new Uint32Array(indexArray),
      canvas.gl.STATIC_DRAW
    )
    this.sphere.index.itemSize = 1
    this.sphere.index.numItems = indexArray.length

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.sphere.normal)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      new Float32Array(normalArray),
      canvas.gl.STATIC_DRAW
    )
    this.sphere.normal.itemSize = 3
    this.sphere.normal.numItems =
      normalArray.length / this.sphere.normal.itemSize
  }

  initCube () {
    this.cube = {
      position: canvas.gl.createBuffer(),
      index: canvas.gl.createBuffer(),
      normal: canvas.gl.createBuffer()
    }

    var vertices = [
      -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
      -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
      -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,
      0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
      -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5
    ]
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.cube.position)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      canvas.gl.STATIC_DRAW
    )
    this.cube.position.itemSize = 3
    this.cube.position.numItems = vertices.length / 3

    var normals = [
      // Front face
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      // Back face
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
      // Top face
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      // Bottom face
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
      // Right face
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
      // Left face
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0
    ]
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.cube.normal)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      new Float32Array(normals),
      canvas.gl.STATIC_DRAW
    )
    this.cube.normal.itemSize = 3
    this.cube.normal.numItems = normals.length / 3

    var indices = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
    ]
    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.cube.index)
    canvas.gl.bufferData(
      canvas.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      canvas.gl.STATIC_DRAW
    )
    this.cube.index.itemSize = 1
    this.cube.index.numItems = indices.length
  }
}

class Texture {
  constructor () {
    this.initTable()
  }

  initTable () {
    this.table = canvas.gl.createTexture()
    canvas.gl.activeTexture(canvas.gl.TEXTURE2)

    var image = new Image()
    image.src = 'assets/images/wood_texture.jpg'
    image.onload = () => {
      canvas.gl.activeTexture(canvas.gl.TEXTURE2)
      canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, this.table)
      canvas.gl.texImage2D(
        canvas.gl.TEXTURE_2D,
        0,
        canvas.gl.RGB,
        canvas.gl.RGB,
        canvas.gl.UNSIGNED_BYTE,
        image
      )
      canvas.gl.generateMipmap(canvas.gl.TEXTURE_2D)
      canvas.gl.texParameteri(
        canvas.gl.TEXTURE_2D,
        canvas.gl.TEXTURE_MAG_FILTER,
        canvas.gl.LINEAR
      )
      canvas.gl.texParameteri(
        canvas.gl.TEXTURE_2D,
        canvas.gl.TEXTURE_MIN_FILTER,
        canvas.gl.LINEAR_MIPMAP_LINEAR
      )
    }
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
    this.indexArray = [
      0, 1, 2, 2, 1, 3, 4, 6, 5, 6, 7, 5, 0, 4, 1, 4, 5, 1, 2, 3, 6, 6, 3, 7, 0,
      2, 4, 2, 6, 4, 1, 5, 3, 3, 5, 7
    ]
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
    this.shader = new Shader(shaders.skybox)
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

    canvas.gl.uniformMatrix4fv(
      this.locations.uPMatrix,
      false,
      globalVars.pMatrix
    )
    canvas.gl.uniformMatrix4fv(
      this.locations.uMVMatrix,
      false,
      globalVars.mvMatrix
    )
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
    this.shader = new Shader(shaders.teapot)
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
    canvas.gl.uniformMatrix4fv(
      this.locations.uVMatrix,
      false,
      globalVars.mvMatrix
    )
    canvas.gl.uniformMatrix4fv(
      this.locations.uPMatrix,
      false,
      globalVars.pMatrix
    )
    canvas.gl.uniform3fv(this.locations.uViewOrigin, globalVars.viewOrigin)
    canvas.gl.uniform1i(this.locations.uEnv, 0)

    canvas.gl.uniform3fv(
      this.locations.uLightDirection,
      globalVars.lightDirection
    )
    canvas.gl.uniform3fv(this.locations.uAmbientLight, globalVars.ambientLight)
    canvas.gl.uniform3fv(this.locations.uDiffuseLight, globalVars.diffuseLight)
    canvas.gl.uniform3fv(
      this.locations.uSpecularLight,
      globalVars.specularLight
    )

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

class Ball {
  constructor (color, number) {
    this.color = [color[0] / 255, color[1] / 255, color[2] / 255]
    this.number = number

    this.init()
  }

  init () {
    this.initShader()
    this.initBuffer()
    this.initMatrices()
  }

  initShader () {
    this.shader = sphereShader
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
    this.buffer = buffer.sphere
  }

  initMatrices () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)

    if (this.number === 1) {
      this.mMatrix = mat4.translate(this.mMatrix, [0, -0.06, 0.35])
      mat4.scale(this.mMatrix, [0.1, 0.1, 0.1])
    } else {
      this.mMatrix = mat4.translate(this.mMatrix, [0.3, -0.11, 0.1])
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
    canvas.gl.uniformMatrix4fv(
      this.locations.uVMatrix,
      false,
      globalVars.mvMatrix
    )
    canvas.gl.uniformMatrix4fv(
      this.locations.uPMatrix,
      false,
      globalVars.pMatrix
    )
    canvas.gl.uniform3fv(this.locations.uViewOrigin, globalVars.viewOrigin)
    canvas.gl.uniform1i(this.locations.uEnv, 0)
    canvas.gl.uniform3fv(
      this.locations.uLightDirection,
      globalVars.lightDirection
    )
    canvas.gl.uniform3fv(this.locations.uAmbientLight, globalVars.ambientLight)
    canvas.gl.uniform3fv(this.locations.uDiffuseLight, globalVars.diffuseLight)
    canvas.gl.uniform3fv(
      this.locations.uSpecularLight,
      globalVars.specularLight
    )
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

class RubiksCube {
  constructor (imagePath) {
    this.imagePath = imagePath
    this.size = 0.4

    this.init()
  }

  init () {
    this.initShape()
    this.initTexture()
    this.initShader()
    this.initBuffer()
    this.initMatrices()
  }

  initShape () {
    this.indexArray = [
      0, 2, 1, 2, 3, 1, 4, 5, 6, 6, 5, 7, 0, 1, 4, 4, 1, 5, 2, 6, 3, 6, 7, 3, 0,
      4, 2, 2, 4, 6, 1, 3, 5, 3, 7, 5
    ]
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
  }

  initTexture () {
    this.texture = canvas.gl.createTexture()
    canvas.gl.activeTexture(canvas.gl.TEXTURE1)
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
      this.imagePath
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      this.texture,
      this.imagePath
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      this.texture,
      this.imagePath
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      this.texture,
      this.imagePath
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      this.texture,
      this.imagePath
    )
    this.loadCubeMap(
      canvas.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      this.texture,
      this.imagePath,
      () => {
        canvas.gl.generateMipmap(canvas.gl.TEXTURE_CUBE_MAP)
      }
    )
  }

  loadCubeMap (target, texture, url, callback) {
    var image = new Image()
    image.src = url
    image.addEventListener('load', () => {
      canvas.gl.activeTexture(canvas.gl.TEXTURE1)
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
    this.shader = new Shader(shaders.rubiksCube)
    this.locations = {
      aVertexPosition: canvas.gl.getAttribLocation(
        this.shader.program,
        'aVertexPosition'
      ),
      uPMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uPMatrix'),
      uMVMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uMVMatrix'),
      uMMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uMMatrix'),
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

  initMatrices () {
    this.modelMatrix = mat4.create()
    mat4.identity(this.modelMatrix)
    mat4.translate(this.modelMatrix, [0.3, -0.1, 0.3])
    mat4.scale(this.modelMatrix, [0.15, 0.15, 0.15])
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

    canvas.gl.uniformMatrix4fv(
      this.locations.uPMatrix,
      false,
      globalVars.pMatrix
    )
    canvas.gl.uniformMatrix4fv(
      this.locations.uMVMatrix,
      false,
      globalVars.mvMatrix
    )
    canvas.gl.uniformMatrix4fv(this.locations.uMMatrix, false, this.modelMatrix)
    canvas.gl.uniform1i(this.locations.uEnv, 1)
    canvas.gl.activeTexture(canvas.gl.TEXTURE1)
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

class TableTop {
  constructor () {
    this.init()
  }

  init () {
    this.initShader()
    this.initBuffer()
    this.initMatrices()
  }

  initShader () {
    this.shader = new Shader(shaders.tableTop)
    this.locations = {
      aPosition: canvas.gl.getAttribLocation(
        this.shader.program,
        'aVertexPosition'
      ),
      aNormal: canvas.gl.getAttribLocation(
        this.shader.program,
        'aVertexNormal'
      ),
      uMMatrix: canvas.gl.getUniformLocation(
        this.shader.program,
        'uModelMatrix'
      ),
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
      ),
      uTextureLocation: canvas.gl.getUniformLocation(
        this.shader.program,
        'uTextureMap'
      )
    }
  }

  initBuffer () {
    this.buffer = buffer.sphere
  }

  initMatrices () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)
    this.mMatrix = mat4.translate(this.mMatrix, [0, -0.3, 0])
    mat4.scale(this.mMatrix, [0.9, 0.05, 0.6])
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
    canvas.gl.uniformMatrix4fv(
      this.locations.uVMatrix,
      false,
      globalVars.mvMatrix
    )
    canvas.gl.uniformMatrix4fv(
      this.locations.uPMatrix,
      false,
      globalVars.pMatrix
    )
    canvas.gl.uniform3fv(this.locations.uViewOrigin, globalVars.viewOrigin)
    canvas.gl.uniform1i(this.locations.uEnv, 0)
    canvas.gl.uniform3fv(
      this.locations.uLightDirection,
      globalVars.lightDirection
    )
    canvas.gl.uniform3fv(this.locations.uAmbientLight, globalVars.ambientLight)
    canvas.gl.uniform3fv(this.locations.uDiffuseLight, globalVars.diffuseLight)
    canvas.gl.uniform3fv(
      this.locations.uSpecularLight,
      globalVars.specularLight
    )
    canvas.gl.uniform3fv(this.locations.vVertexColor, [52, 66, 125])
    canvas.gl.uniform1i(this.locations.uTextureLocation, 2)

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

class TableLeg {
  constructor (number) {
    this.number = number

    this.init()
  }

  init () {
    this.initShader()
    this.initBuffer()
    this.initMatrices()
  }

  initShader () {
    this.shader = tableLegShader
    this.locations = {
      aPosition: canvas.gl.getAttribLocation(
        this.shader.program,
        'aVertexPosition'
      ),
      aNormal: canvas.gl.getAttribLocation(
        this.shader.program,
        'aVertexNormal'
      ),
      uMMatrix: canvas.gl.getUniformLocation(
        this.shader.program,
        'uModelMatrix'
      ),
      uVMatrix: canvas.gl.getUniformLocation(this.shader.program, 'uMVMatrix'),
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
      ),
      uTextureLocation: canvas.gl.getUniformLocation(
        this.shader.program,
        'uTextureMap'
      )
    }
  }

  initBuffer () {
    this.buffer = buffer.cube
  }

  initMatrices () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)
    if (this.number === 1) {
      this.mMatrix = mat4.translate(this.mMatrix, [0.5, -0.6, -0.2])
    } else if (this.number === 2) {
      this.mMatrix = mat4.translate(this.mMatrix, [-0.5, -0.6, -0.2])
    } else if (this.number === 3) {
      this.mMatrix = mat4.translate(this.mMatrix, [-0.5, -0.6, 0.2])
    } else if (this.number === 4) {
      this.mMatrix = mat4.translate(this.mMatrix, [0.5, -0.6, 0.2])
    }
    mat4.scale(this.mMatrix, [0.1, 0.5, 0.1])
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
    canvas.gl.uniformMatrix4fv(
      this.locations.uVMatrix,
      false,
      globalVars.mvMatrix
    )
    canvas.gl.uniformMatrix4fv(
      this.locations.uPMatrix,
      false,
      globalVars.pMatrix
    )
    canvas.gl.uniform3fv(this.locations.uViewOrigin, globalVars.viewOrigin)
    canvas.gl.uniform1i(this.locations.uEnv, 0)
    canvas.gl.uniform3fv(
      this.locations.uLightDirection,
      globalVars.lightDirection
    )
    canvas.gl.uniform3fv(this.locations.uAmbientLight, globalVars.ambientLight)
    canvas.gl.uniform3fv(this.locations.uDiffuseLight, globalVars.diffuseLight)
    canvas.gl.uniform3fv(
      this.locations.uSpecularLight,
      globalVars.specularLight
    )
    canvas.gl.uniform3fv(this.locations.vVertexColor, [32, 82, 64])
    canvas.gl.uniform1i(this.locations.uTextureLocation, 2)

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

class Box {
  constructor () {
    this.init()
  }

  init () {
    this.initShader()
    this.initBuffer()
    this.initMatrices()
  }

  initShader () {
    this.shader = new Shader(shaders.box)
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
    this.buffer = buffer.cube
  }

  initMatrices () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)
    this.mMatrix = mat4.translate(this.mMatrix, [-0.35, -0.1, 0.2])
    mat4.scale(this.mMatrix, [0.15, 0.25, 0.15])
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
    canvas.gl.uniformMatrix4fv(
      this.locations.uVMatrix,
      false,
      globalVars.mvMatrix
    )
    canvas.gl.uniformMatrix4fv(
      this.locations.uPMatrix,
      false,
      globalVars.pMatrix
    )
    canvas.gl.uniform3fv(this.locations.uViewOrigin, globalVars.viewOrigin)
    canvas.gl.uniform1i(this.locations.uEnv, 0)

    canvas.gl.uniform3fv(
      this.locations.uLightDirection,
      globalVars.lightDirection
    )
    canvas.gl.uniform3fv(this.locations.uAmbientLight, globalVars.ambientLight)
    canvas.gl.uniform3fv(this.locations.uDiffuseLight, globalVars.diffuseLight)
    canvas.gl.uniform3fv(
      this.locations.uSpecularLight,
      globalVars.specularLight
    )

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

const updateMatrices = () => {
  globalVars.viewAngle += globalVars.viewAngleStep
  globalVars.viewOrigin = [
    2 * Math.cos(globalVars.viewAngle),
    1.0,
    2 * Math.sin(globalVars.viewAngle)
  ]
  globalVars.viewLookAt = [
    -Math.cos(globalVars.viewAngle),
    0.0,
    -Math.sin(globalVars.viewAngle)
  ]
  mat4.lookAt(
    globalVars.viewOrigin,
    globalVars.viewCenter,
    globalVars.viewUp,
    globalVars.mvMatrix
  )
}

const initialize = () => {
  canvas = new Canvas('canvas')
  buffer = new Buffer()
  texture = new Texture()
  mat4.identity(globalVars.pMatrix)
  mat4.perspective(
    50,
    canvas.gl.viewportWidth / canvas.gl.viewportHeight,
    0.1,
    1000,
    globalVars.pMatrix
  )

  skybox = new Skybox('assets/images/')
  teapot = new Teapot('assets/meshes/teapot.json')

  sphereShader = new Shader(shaders.sphere)
  ball1 = new Ball([32, 82, 64], 1)
  ball2 = new Ball([52, 66, 125], 2)
  rubiksCube = new RubiksCube('assets/images/rcube.png')
  tableTop = new TableTop()
  tableLegShader = new Shader(shaders.tableLeg)
  tableLeg1 = new TableLeg(1)
  tableLeg2 = new TableLeg(2)
  tableLeg3 = new TableLeg(3)
  tableLeg4 = new TableLeg(4)
  box = new Box()
}

const drawScene = () => {
  requestAnimationFrame(drawScene)
  updateMatrices()

  canvas.clear()
  skybox.draw()
  teapot.draw()
  ball1.draw()
  ball2.draw()
  rubiksCube.draw()
  tableTop.draw()
  tableLeg1.draw()
  tableLeg2.draw()
  tableLeg3.draw()
  tableLeg4.draw()
  box.draw()
}

const webGLStart = () => {
  initialize()
  drawScene()
}
