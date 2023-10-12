/** @type {Canvas} */
var canvas

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
