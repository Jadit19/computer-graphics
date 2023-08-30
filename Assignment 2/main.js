/** @type {Canvas} */
var canvas1, canvas2, canvas3

var position, positionSlider
var zoom, zoomSlider

const addEventListeners = () => {
  position = 50
  positionSlider = document.getElementById('position')
  positionSlider.addEventListener('input', () => {
    position = positionSlider.value
    drawScene()
  })

  zoom = 50
  zoomSlider = document.getElementById('zoom')
  zoomSlider.addEventListener('input', () => {
    zoom = 100 - zoomSlider.value
    drawScene()
  })
}

const initialize = () => {
  canvas1.addCube([0, 0, 0])
  canvas1.addSphere([0, 0, 0])
}

const drawScene = () => {
  canvas1.draw()
  // canvas2.draw()
  // canvas3.draw()
}

const webGLStart = () => {
  addEventListeners()
  canvas1 = new Canvas('canvas1', [212, 211, 239])
  // canvas2 = new Canvas('canvas2', [239, 210, 211])
  // canvas3 = new Canvas('canvas3', [212, 238, 213])

  initialize()
  drawScene()
}
