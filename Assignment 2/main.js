var position, positionSlider
var zoom, zoomSlider
const addEventListeners = () => {
  position = 0
  positionSlider = document.getElementById('position')
  positionSlider.addEventListener('input', () => {
    position = positionSlider.value
    drawScene()
  })

  zoom = 90
  zoomSlider = document.getElementById('zoom')
  zoomSlider.addEventListener('input', () => {
    zoom = zoomSlider.value
    drawScene()
  })

  console.warn = () => {}
}

const initialize = () => {
  viewport1.degree0 = 30
  viewport1.addSphere([1, 114, 173])
  viewport1.translateObject(0, 0, 1, 0)
  viewport1.addCube([177, 176, 118])
  viewport1.translateObject(1, 0, -0.25, 0)
  viewport1.scaleObject(1, 1, 1.5, 1)

  viewport2.addSphere([150, 150, 150])
  viewport2.translateObject(0, 0, -0.75, 0)
  viewport2.scaleObject(0, 1.5, 1.5, 1.5)
  viewport2.addCube([35, 214, 38])
  viewport2.scaleObject(1, 0.8, 0.8, 0.8)
  viewport2.addSphere([150, 150, 150])
  viewport2.translateObject(2, -0.8, 0.55, 0)
  viewport2.addCube([35, 214, 38])
  viewport2.scaleObject(3, 0.6, 0.6, 0.6)
  viewport2.addSphere([150, 150, 150])
  viewport2.scaleObject(4, 0.6, 0.6, 0.6)
  viewport2.translateObject(4, -0.2, 1.35, 0.35)

  viewport3.degree0 = 30
  viewport3.degree1 = 10
  viewport3.addCube([146, 144, 0])
  viewport3.translateObject(0, -0.8, 0, 0)
  viewport3.scaleObject(0, 0.7, 0.1, 1.4)
  viewport3.addCube([41, 145, 14])
  viewport3.translateObject(1, 0.8, 0, 0)
  viewport3.scaleObject(1, 0.7, 0.1, 1.4)
  viewport3.addSphere([173, 0, 172])
  viewport3.translateObject(2, -0.8, 0.4, 0)
  viewport3.scaleObject(2, 0.7, 0.7, 0.7)
  viewport3.addSphere([70, 69, 148])
  viewport3.translateObject(3, -0.8, -0.4, 0)
  viewport3.scaleObject(3, 0.7, 0.7, 0.7)
  viewport3.addSphere([152, 105, 34])
  viewport3.translateObject(4, 0.8, 0.4, 0)
  viewport3.scaleObject(4, 0.7, 0.7, 0.7)
  viewport3.addSphere([37, 116, 138])
  viewport3.translateObject(5, 0.8, -0.4, 0)
  viewport3.scaleObject(5, 0.7, 0.7, 0.7)
  viewport3.addCube([135, 46, 17])
  viewport3.translateObject(6, 0, 0.8, 0)
  viewport3.scaleObject(6, 2, 0.1, 0.5)
  viewport3.addCube([153, 52, 19])
  viewport3.translateObject(7, 0, -0.8, 0)
  viewport3.scaleObject(7, 2, 0.1, 0.5)
  viewport3.addSphere([113, 111, 142])
  viewport3.translateObject(8, 0, 1.35, 0)
  viewport3.addSphere([10, 198, 42])
  viewport3.translateObject(9, 0, -1.35, 0)
}

const drawScene = () => {
  viewport1.draw()
  viewport2.draw()
  viewport3.draw()
}

const webGLStart = () => {
  addEventListeners()
  canvas = new Canvas('canvas')
  buffer = new Buffer()

  viewport1 = new Viewport(1, [212, 211, 239])
  viewport2 = new Viewport(2, [239, 210, 211])
  viewport3 = new Viewport(3, [212, 238, 213])

  initialize()
  drawScene()
}
