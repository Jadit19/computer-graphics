class Canvas {
  constructor (canvasId, background) {
    this.element = document.getElementById(canvasId)
    this.init = new Init(this.element, background)
    this.buffer = new Buffer(this.init.gl)

    this.objects = []
  }

  addCube (color) {
    let newCube = new Cube(color)
    this.objects.push(newCube)
  }

  addSphere (color) {
    let newSphere = new Sphere(color)
    this.objects.push(newSphere)
  }

  draw () {
    this.init.clear()

    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].addPerspective()
      this.objects[i].draw(this.buffer, this.init)
    }
  }
}
