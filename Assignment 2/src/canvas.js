class Canvas {
  constructor (canvasId, background) {
    this.element = document.getElementById(canvasId)
    this.init = new Init(this.element, background)
    this.buffer = new Buffer(this.init.gl)

    this.cube = new Cube([0, 0, 0])
    this.sphere = new Sphere([0, 0, 0])
  }

  draw () {
    this.init.clear()
    this.cube.draw(this.buffer, this.init)
    this.sphere.draw(this.buffer, this.init)
  }
}
