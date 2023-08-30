class Canvas {
  constructor (canvasId, background) {
    this.element = document.getElementById(canvasId)
    this.init = new Init(this.element, background)
    this.buffer = new Buffer(this.init.gl)
    this.objects = []

    this.addEventListeners()
  }

  addEventListeners () {
    this.degree0 = 0.0
    this.degree1 = 0.0
    this.prevMouseX = 0.0
    this.prevMouseY = 0.0
    this.listenEvents = false

    this.element.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this),
      false
    )
    this.element.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
      false
    )
    this.element.addEventListener('mouseup', this.onMouseUp.bind(this), false)
    this.element.addEventListener('mouseout', this.onMouseOut.bind(this), false)
  }

  onMouseDown (event) {
    this.listenEvents = true

    if (
      event.layerX <= this.element.width &&
      event.layerX >= 0 &&
      event.layerY <= this.element.height &&
      event.layerY >= 0
    ) {
      this.prevMouseX = event.clientX
      this.prevMouseY = this.element.height - event.clientY
    }
  }
  onMouseMove (event) {
    if (!this.listenEvents) {
      return
    }

    if (
      event.layerX <= this.element.width &&
      event.layerX >= 0 &&
      event.layerY <= this.element.height &&
      event.layerY >= 0
    ) {
      var mouseX = event.clientX
      var diffX1 = mouseX - this.prevMouseX
      this.prevMouseX = mouseX
      this.degree0 = this.degree0 + diffX1 / 5

      var mouseY = this.element.height - event.clientY
      var diffY2 = mouseY - this.prevMouseY
      this.prevMouseY = mouseY
      this.degree1 = this.degree1 - diffY2 / 5

      this.draw()
    }
  }
  onMouseUp (event) {
    this.listenEvents = false
  }
  onMouseOut (event) {
    this.listenEvents = false
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
      this.objects[i].clearAll()
      this.objects[i].addPerspective()
      this.objects[i].rotateY(this.degree0)
      this.objects[i].rotateX(this.degree1)
      this.objects[i].draw(this.buffer, this.init)
    }
  }
}
