var drawMode = 3
var animation

/** @type {Init} */
var init

/** @type {Buffer} */
var buffer

/** @type {Sun} */
var sun

/** @type {Cloud} */
var cloud

/** @type {Mountain} */
var leftMountain, centerMountain, rightMountain

/** @type {Background} */
var background

/** @type {Tree} */
var leftTree, centerTree, rightTree

/** @type {Bird} */
var bird1, bird2, bird3, bird4, bird5

var color = {
  backgroud: [128, 202, 250]
}

const changeDrawMode = newDrawMode => {
  drawMode = newDrawMode
}

const animate = () => {
  animation = window.requestAnimationFrame(animate)
  init.clear()

  sun.draw()
  cloud.draw()
  bird1.draw()
  bird2.draw()
  bird3.draw()
  bird4.draw()
  bird5.draw()

  leftMountain.draw()
  rightMountain.draw()
  centerMountain.draw()
  background.draw()

  rightTree.draw()
  centerTree.draw()
  leftTree.draw()
}

const drawScene = () => {
  if (animation) {
    window.cancelAnimationFrame(animation)
  }

  animate()
}

const initialize = () => {
  sun = new Sun()
  cloud = new Cloud()
  bird1 = new Bird()
  bird2 = new Bird()
  bird3 = new Bird()
  bird4 = new Bird()
  bird5 = new Bird()

  leftMountain = new Mountain()
  centerMountain = new Mountain()
  rightMountain = new Mountain()
  background = new Background()

  leftTree = new Tree()
  centerTree = new Tree()
  rightTree = new Tree()
}

const alignPositions = () => {
  bird2.translate(-0.2, 0.25)
  bird2.scale(0.7)
  bird3.translate(0.2, 0.35)
  bird3.scale(0.7)
  bird4.translate(-0.066, 0.45)
  bird4.scale(0.5)
  bird5.translate(0, 0.64)
  bird5.scale(0.3)

  leftMountain.translate(-0.6, 0)
  leftMountain.scale(1.3)
  centerMountain.scale(1.9)
  centerMountain.translate(0.1, 0)
  rightMountain.translate(0.9, 0)
  rightMountain.scale(1.2)

  leftTree.translate(0.1, 0.21)
  leftTree.scale(0.35)
  centerTree.translate(0.33, 0.3)
  centerTree.scale(0.48)
  rightTree.translate(0.65, 0.25)
  rightTree.scale(0.4)
}

const webGLStart = () => {
  const canvas = document.getElementById('canvas')

  init = new Init(canvas, color.backgroud)
  buffer = new Buffer()

  initialize()
  alignPositions()
  drawScene()
}
