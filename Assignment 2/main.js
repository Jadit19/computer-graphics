/** @type {Canvas} */
var canvas1, canvas2, canvas3

var position, positionSlider
var zoom, zoomSlider
var drawMode

const changeDrawMode = newDrawMode => {
  drawMode = newDrawMode
  drawScene()
}

const addEventListeners = () => {
  position = 50
  positionSlider = document.getElementById('position')
  positionSlider.addEventListener('input', () => {
    position = positionSlider.value
    drawScene()
  })

  zoom = 100
  zoomSlider = document.getElementById('zoom')
  zoomSlider.addEventListener('input', () => {
    zoom = 150 - zoomSlider.value
    drawScene()
  })
}

const initialize = () => {
  drawMode = 2

  canvas1.addSphere([0, 0, 0])
  canvas1.translateObject(0, 0, 1, 0)
  canvas1.addCube([0, 0, 0])
  canvas1.translateObject(1, 0, -0.25, 0)
  canvas1.scaleObject(1, 1, 1.5, 1)

  canvas2.addSphere([0, 0, 0])
  canvas2.translateObject(0, 0, -0.75, 0)
  canvas2.scaleObject(0, 1.5, 1.5, 1.5)
  // canvas2.addCube([0, 0, 0])
  // canvas2.translateObject(1, -0.35, 0, 0)
  // canvas2.scaleObject(1, 0.7, 0.7, 0.7)

  canvas3.addCube([0, 0, 0])
  canvas3.translateObject(0, -0.8, 0, 0)
  canvas3.scaleObject(0, 0.7, 0.1, 1)
  canvas3.addCube([0, 0, 0])
  canvas3.translateObject(1, 0.8, 0, 0)
  canvas3.scaleObject(1, 0.7, 0.1, 1)
  canvas3.addSphere([0, 0, 0])
  canvas3.translateObject(2, -0.8, 0.4, 0)
  canvas3.scaleObject(2, 0.7, 0.7, 0.7)
  canvas3.addSphere([0, 0, 0])
  canvas3.translateObject(3, -0.8, -0.4, 0)
  canvas3.scaleObject(3, 0.7, 0.7, 0.7)
  canvas3.addSphere([0, 0, 0])
  canvas3.translateObject(4, 0.8, 0.4, 0)
  canvas3.scaleObject(4, 0.7, 0.7, 0.7)
  canvas3.addSphere([0, 0, 0])
  canvas3.translateObject(5, 0.8, -0.4, 0)
  canvas3.scaleObject(5, 0.7, 0.7, 0.7)
  canvas3.addCube([0, 0, 0])
  canvas3.translateObject(6, 0, 0.8, 0)
  canvas3.scaleObject(6, 2, 0.1, 0.5)
  canvas3.addCube([0, 0, 0])
  canvas3.translateObject(7, 0, -0.8, 0)
  canvas3.scaleObject(7, 2, 0.1, 0.5)
  canvas3.addSphere([0, 0, 0])
  canvas3.translateObject(8, 0, 1.35, 0)
  canvas3.addSphere([0, 0, 0])
  canvas3.translateObject(9, 0, -1.35, 0)
}

const drawScene = () => {
  canvas1.draw()
  canvas2.draw()
  canvas3.draw()
}

const webGLStart = () => {
  addEventListeners()
  canvas1 = new Canvas(1, [212, 211, 239])
  canvas2 = new Canvas(2, [239, 210, 211])
  canvas3 = new Canvas(3, [212, 238, 213])

  initialize()
  drawScene()
}
