const vertexCode = `#version 300 es

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPosition, 0, 1);
}`

const fragmentCode = `#version 300 es
precision mediump float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform float mode;
uniform float coloring;
uniform float brightness;
uniform float contrast;
uniform sampler2D uBackgroundSampler;
uniform sampler2D uForegroundSampler;

void main(){

  vec4 postMode;
  if (mode == 0.0) {
    postMode = texture(uBackgroundSampler, vTexCoord);
  } else if (mode == 1.0){
    vec4 colorBackground = texture(uBackgroundSampler, vTexCoord);
    vec4 colorForeground = texture(uForegroundSampler, vTexCoord);
    float af =  colorForeground.a;
    postMode = af * colorForeground + (1.0 - af) * colorBackground;
  }

  vec4 postColoring;
  if (coloring == 0.0) {
    postColoring = postMode;
  } else if (coloring == 1.0){
    float gray = 0.2126*postMode.r + 0.7152*postMode.g + 0.0722*postMode.b;
    postColoring = vec4(gray, gray, gray, postMode.a);
  } else if (coloring == 2.0) {
    float sr = 0.393*postMode.r + 0.769*postMode.g + 0.189*postMode.b;
    float sg = 0.349*postMode.r + 0.686*postMode.g + 0.168*postMode.b;
    float sb = 0.272*postMode.r + 0.534*postMode.g + 0.131*postMode.b;
    postColoring = vec4(sr,sg,sb,postMode.a);
  }

  vec4 postContrast = vec4(0.5 + (contrast+1.0)*(postColoring.rgb - 0.5), postColoring.a);
  vec4 postBrightness = clamp(vec4(postContrast.rgb + brightness, postContrast.a), 0.0, 1.0);

  fragColor = postBrightness;
}`

/** @type {Canvas} */
var canvas

/** @type {Buffer} */
var buffer

/** @type {Shader} */
var shader

/** @type {Inputs} */
var inputs

/** @type {Texture} */
var foregroundTexture, backgroundTexture

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
    this.locations = {
      aPosition: canvas.gl.getAttribLocation(this.program, 'aPosition'),
      aTexCoord: canvas.gl.getAttribLocation(this.program, 'aTexCoord'),
      uBackgroundSampler: canvas.gl.getUniformLocation(
        this.program,
        'uBackgroundSampler'
      ),
      uForegroundSampler: canvas.gl.getUniformLocation(
        this.program,
        'uForegroundSampler'
      ),
      mode: canvas.gl.getUniformLocation(this.program, 'mode'),
      coloring: canvas.gl.getUniformLocation(this.program, 'coloring'),
      brightness: canvas.gl.getUniformLocation(this.program, 'brightness'),
      contrast: canvas.gl.getUniformLocation(this.program, 'contrast')
    }
  }
}

class Inputs {
  constructor () {
    this.setupBackground()
    this.setupForeground()
    this.setupMode()
    this.setupColoring()
    this.setupContrast()
    this.setupBrightness()
    this.setupProcesses()
    this.setupReset()
    this.setupSave()
  }

  setupBackground () {
    this.background = new Image()
    this.background.src = 'assets/background.jpg'
    backgroundTexture = new Texture(this.background, 0)
    // const backgroundButton = document.getElementById('background')
    // backgroundButton.addEventListener('change', event => {
    //   const file = event.target.files[0]
    //   if (file) {
    //     const reader = new FileReader()
    //     reader.addEventListener('load', e => {
    //       this.background.src = e.target.result
    //       drawScene()
    //     })
    //     reader.readAsDataURL(file)
    //   }
    // })
  }

  setupForeground () {
    this.foreground = new Image()
    this.foreground.src = 'assets/foreground.png'
    foregroundTexture = new Texture(this.foreground, 1)
    // const foregroundButton = document.getElementById('foreground')
    // foregroundButton.addEventListener('change', event => {
    //   const file = event.target.files[0]
    //   if (file) {
    //     const reader = new FileReader()
    //     reader.addEventListener('load', e => {
    //       this.foreground.src = e.target.result
    //       drawScene()
    //     })
    //     reader.readAsDataURL(file)
    //   }
    // })
  }

  setupMode () {
    this.mode = 1.0
    document.getElementById('mode-bg-only').addEventListener('change', e => {
      this.mode = 0.0
      drawScene()
    })
    document.getElementById('mode-alpha').addEventListener('change', e => {
      this.mode = 1.0
      drawScene()
    })
  }

  setupColoring () {
    this.color = 0
    document.getElementById('color-original').addEventListener('change', e => {
      this.color = 0.0
      drawScene()
    })
    document.getElementById('color-grayscale').addEventListener('change', e => {
      this.color = 1.0
      drawScene()
    })
    document.getElementById('color-sepia').addEventListener('change', e => {
      this.color = 2.0
      drawScene()
    })
  }

  setupContrast () {
    this.contrast = 0
    document.getElementById('contrast').addEventListener('input', e => {
      this.contrast = e.target.value
      drawScene()
    })
  }

  setupBrightness () {
    this.brightness = 0
    document.getElementById('brightness').addEventListener('input', e => {
      this.brightness = e.target.value
      drawScene()
    })
  }

  setupProcesses () {
    this.process = 0
    document.getElementById('process-none').addEventListener('change', e => {
      this.process = 0.0
      drawScene()
    })
    document.getElementById('process-smooth').addEventListener('change', e => {
      this.process = 1.0
      drawScene()
    })
    document.getElementById('process-sharpen').addEventListener('change', e => {
      this.process = 2.0
      drawScene()
    })
    document
      .getElementById('process-gradient')
      .addEventListener('change', e => {
        this.process = 3.0
        drawScene()
      })
    document
      .getElementById('process-laplacian')
      .addEventListener('change', e => {
        this.process = 4.0
        drawScene()
      })
  }

  setupReset () {
    document.getElementById('reset').addEventListener('click', () => {
      this.mode = 1.0
      document.getElementById('mode-alpha').click()

      this.color = 0.0
      document.getElementById('color-original').click()

      this.contrast = 0.0
      document.getElementById('contrast').value = 0.0

      this.brightness = 0.0
      document.getElementById('brightness').value = 0.0

      this.process = 0.0
      document.getElementById('process-none').click()

      drawScene()
    })
  }

  setupSave () {
    document.getElementById('save').addEventListener('click', () => {
      console.log('Saved')
      const link = document.createElement('a')
      link.download = 'download.png'
      link.href = canvas.element.toDataURL('image/png', 'image/octet-stream')
      link.click()
      link.delete
    })
  }
}

class Texture {
  constructor (image, number) {
    /** @type {Image} */
    this.image = image
    this.number = number

    this.init()
  }

  init () {
    this.texture = canvas.gl.createTexture()
    canvas.gl.activeTexture(canvas.gl.TEXTURE0 + this.number)
    canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, this.texture)
    canvas.gl.texImage2D(
      canvas.gl.TEXTURE_2D,
      0,
      canvas.gl.RGBA,
      this.image.width,
      this.image.height,
      0,
      canvas.gl.RGBA,
      canvas.gl.UNSIGNED_BYTE,
      this.image
    )
    canvas.gl.generateMipmap(canvas.gl.TEXTURE_2D)
    canvas.gl.texParameteri(
      canvas.gl.TEXTURE_2D,
      canvas.gl.TEXTURE_MIN_FILTER,
      canvas.gl.NEAREST
    )
    canvas.gl.texParameteri(
      canvas.gl.TEXTURE_2D,
      canvas.gl.TEXTURE_MAG_FILTER,
      canvas.gl.NEAREST
    )
  }
}

class Buffer {
  constructor () {
    this.init()
  }

  init () {
    this.setupPosition()
    this.setupIndex()
    this.setupCoords()
  }

  setupPosition () {
    const data = new Float32Array([1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0])
    this.position = canvas.gl.createBuffer()
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.position)
    canvas.gl.bufferData(canvas.gl.ARRAY_BUFFER, data, canvas.gl.STATIC_DRAW)
  }

  setupIndex () {
    const data = new Uint16Array([0, 1, 2, 0, 2, 3])
    this.index = canvas.gl.createBuffer()
    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, this.index)
    canvas.gl.bufferData(
      canvas.gl.ELEMENT_ARRAY_BUFFER,
      data,
      canvas.gl.STATIC_DRAW
    )
    this.index.itemSize = 1
    this.index.numItems = 6
  }

  setupCoords () {
    const data = new Float32Array([1, 0, 0, 0, 0, 1, 1, 1])
    this.coords = canvas.gl.createBuffer()
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.coords)
    canvas.gl.bufferData(canvas.gl.ARRAY_BUFFER, data, canvas.gl.STATIC_DRAW)
  }
}

const initialize = () => {
  canvas = new Canvas('canvas')
  buffer = new Buffer()
  shader = new Shader(vertexCode, fragmentCode)
  inputs = new Inputs()

  canvas.clear()
}

const checkErrors = () => {
  if (inputs.background.src === '') {
    document.getElementById('alert').innerText = 'Background Image not loaded!'
    document.getElementById('alert').style.padding = '10px'
    return true
  }

  if (inputs.mode === 1) {
    if (inputs.foreground.src === '') {
      document.getElementById('alert').innerText =
        'Foreground Image not loaded!'
      document.getElementById('alert').style.padding = '10px'
      return true
    }
  }

  document.getElementById('alert').innerText = ''
  document.getElementById('alert').style.padding = '0px'
  return false
}

const drawScene = () => {
  if (checkErrors()) {
    return
  }

  canvas.clear()

  canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buffer.position)
  canvas.gl.vertexAttribPointer(
    shader.locations.aPosition,
    2,
    canvas.gl.FLOAT,
    false,
    0,
    0
  )
  canvas.gl.enableVertexAttribArray(shader.locations.aPosition)

  canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buffer.coords)
  canvas.gl.vertexAttribPointer(
    shader.locations.aTexCoord,
    2,
    canvas.gl.FLOAT,
    false,
    0,
    0
  )
  canvas.gl.enableVertexAttribArray(shader.locations.aTexCoord)

  canvas.gl.uniform1i(
    shader.locations.uBackgroundSampler,
    backgroundTexture.number
  )
  canvas.gl.uniform1i(
    shader.locations.uForegroundSampler,
    foregroundTexture.number
  )
  canvas.gl.uniform1f(shader.locations.mode, inputs.mode)
  canvas.gl.uniform1f(shader.locations.coloring, inputs.color)
  canvas.gl.uniform1f(shader.locations.brightness, inputs.brightness)
  canvas.gl.uniform1f(shader.locations.contrast, inputs.contrast)

  canvas.gl.drawElements(canvas.gl.TRIANGLES, 6, canvas.gl.UNSIGNED_SHORT, 0)
}

const webGLStart = () => {
  initialize()
  drawScene()
}
