class Canvas {
  constructor (canvasNumber, background) {
    this.canvasNumber = canvasNumber
    this.element = document.getElementById('canvas' + String(canvasNumber))
    this.init = new Init(this.element, background)
    this.buffer = new Buffer(this.init.gl)

    /** @type {Array<PrimitiveBase>} */
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
    var valueX = event.clientX - this.element.width * (this.canvasNumber - 1)

    if (
      valueX <= this.element.width &&
      valueX >= 0 &&
      event.clientY <= this.element.height &&
      event.clientY >= 0
    ) {
      this.prevMouseX = valueX
      this.prevMouseY = this.element.height - event.clientY
    }
  }
  onMouseMove (event) {
    if (!this.listenEvents) {
      return
    }

    var valueX = event.clientX - this.element.width * (this.canvasNumber - 1)
    if (
      valueX <= this.element.width &&
      valueX >= 0 &&
      event.clientY <= this.element.height &&
      event.clientY >= 0
    ) {
      var mouseX = valueX
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

  translateObject (objectNumber, translateX, translateY, translateZ) {
    this.objects[objectNumber].translate(translateX, translateY, translateZ)
  }

  scaleObject (objectNumber, scaleX, scaleY, scaleZ) {
    this.objects[objectNumber].scale(scaleX, scaleY, scaleZ)
  }

  draw () {
    this.init.clear()

    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].clearAll()
      this.objects[i].rotateY(this.degree0)
      this.objects[i].rotateX(this.degree1)
      this.objects[i].addPerspective()
      this.objects[i].draw(this.buffer, this.init)
    }
  }
}
