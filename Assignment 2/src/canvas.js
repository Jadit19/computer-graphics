/** @type{Canvas} */
var canvas
class Canvas {
  constructor (id) {
    this.element = document.getElementById(id)

    this.setupGL()
  }

  setupGL () {
    try {
      /** @type {WebGLRenderingContext} */
      this.gl = this.element.getContext('webgl2')
      this.gl.viewportWidth = this.element.width
      this.gl.viewportHeight = this.element.height
      this.gl.enable(this.gl.DEPTH_TEST)
      this.gl.enable(this.gl.SCISSOR_TEST)
    } catch (e) {
      console.error(e)
    }

    if (!this.gl) {
      alert('[ERROR] WebGL initialization failed!')
    }
  }
}
