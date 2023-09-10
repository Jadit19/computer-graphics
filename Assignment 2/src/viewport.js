/** @type{Viewport} */
var viewport1
/** @type{Viewport} */
var viewport2
/** @type{Viewport} */
var viewport3
class Viewport {
  constructor (number, background) {
    this.number = number - 1
    this.background = background
    this.shadingType =
      this.number === 0 ? 'face' : this.number === 1 ? 'vertex' : 'fragment'
    this.shader = new Shader(this.shadingType)

    /** @type {Array<PrimitiveBase>} */
    this.objects = []

    this.setupEventListeners()
  }

  setupEventListeners () {
    this.degree0 = 0.0
    this.degree1 = 0.0
    this.prevMouseX = 0.0
    this.prevMouseY = 0.0
    this.listenEvents = false

    canvas.element.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this),
      false
    )
    canvas.element.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
      false
    )
    canvas.element.addEventListener('mouseup', this.onMouseUp.bind(this), false)
    canvas.element.addEventListener(
      'mouseout',
      this.onMouseOut.bind(this),
      false
    )
  }
  onMouseDown (event) {
    var valueX = event.clientX - 500 * this.number

    if (
      valueX <= 500 &&
      valueX >= 0 &&
      event.clientY <= 500 &&
      event.clientY >= 0
    ) {
      this.listenEvents = true
      this.prevMouseX = valueX
      this.prevMouseY = 500 - event.clientY
    }
  }
  onMouseMove (event) {
    if (!this.listenEvents) {
      return
    }

    var valueX = event.clientX - 500 * this.number
    if (
      valueX <= 500 &&
      valueX >= 0 &&
      event.clientY <= 500 &&
      event.clientY >= 0
    ) {
      var mouseX = valueX
      var diffX1 = mouseX - this.prevMouseX
      this.prevMouseX = mouseX
      this.degree0 = this.degree0 + diffX1 / 5

      var mouseY = 500 - event.clientY
      var diffY2 = mouseY - this.prevMouseY
      this.prevMouseY = mouseY
      this.degree1 = this.degree1 - diffY2 / 5

      drawScene()
    }
  }
  onMouseUp (event) {
    this.listenEvents = false
  }
  onMouseOut (event) {
    this.listenEvents = false
  }

  translateObject (objectNumber, translateX, translateY, translateZ) {
    this.objects[objectNumber].translate(translateX, translateY, translateZ)
  }

  scaleObject (objectNumber, scaleX, scaleY, scaleZ) {
    this.objects[objectNumber].scale(scaleX, scaleY, scaleZ)
  }

  clear () {
    canvas.gl.viewport(this.number * 500, 0, 500, 500)
    canvas.gl.scissor(this.number * 500, 0, 500, 500)
    canvas.gl.clearColor(
      this.background[0] / 255.0,
      this.background[1] / 255.0,
      this.background[2] / 255.0,
      1.0
    )
    canvas.gl.clear(canvas.gl.COLOR_BUFFER_BIT | canvas.gl.DEPTH_BUFFER_BIT)
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
    this.shader.use()
    this.clear()

    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].rotateX(this.degree1)
      this.objects[i].rotateY(this.degree0)

      if (this.number === 1) {
        if (i === 1) {
          this.objects[i].translateNow(-1.05, -0.3, 0)
          this.objects[i].rotateZ(75)
        } else if (i === 3) {
          this.objects[i].translateNow(-0.13, 0.95, -0.1)
          this.objects[i].rotateZ(20)
          this.objects[i].rotateY(10)
          this.objects[i].rotateX(50)
        }
      }

      this.objects[i].addVariables()
      this.objects[i].draw(this.shader)
      this.objects[i].clear()
    }
  }
}
