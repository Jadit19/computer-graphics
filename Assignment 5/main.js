/** @type {Canvas} */
var canvas

class Canvas {
  constructor (id) {
    this.element = document.getElementById(id)
  }

  init () {
    try {
      /** @type {WebGL2RenderingContext} */
      this.gl = this.element.getContext('webgl2')
      this.gl.viewportWidth = this.element.width
      this.gl.viewportHeight = this.element.height
      this.gl.enable(this.gl.DEPTH_TEST)
    } catch (e) {
      console.log(e)
    } finally {
      if (!this.gl) {
        alert('[ERROR] WebGL initialization failed')
      }
    }
  }

  clear () {
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.clearColor(0.9, 0.9, 0.9, 1.0)
  }
}

const initialize = () => {
  canvas = new Canvas('canvas')
}

const drawScene = () => {
  canvas.clear()
}

const webGLStart = () => {
  initialize()
  drawScene()
}
