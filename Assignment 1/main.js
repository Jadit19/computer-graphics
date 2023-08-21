/** @type {Init} */
var init

/** @type {Buffer} */
var buffer

/** @type {Tree} */
var leftTree, centerTree, rightTree

var color = {
  backgroud: [128, 202, 250]
}

const drawTrees = () => {
  leftTree = new Tree()
  centerTree = new Tree()
  rightTree = new Tree()

  leftTree.translate(0.1, 0.21)
  leftTree.scale(0.35)
  centerTree.translate(0.33, 0.3)
  centerTree.scale(0.48)
  rightTree.translate(0.65, 0.25)
  rightTree.scale(0.4)

  rightTree.draw()
  centerTree.draw()
  leftTree.draw()
}

const drawScene = () => {
  init.clear()

  drawTrees()
}

const webGLStart = () => {
  const canvas = document.getElementById('canvas')

  init = new Init(canvas, color.backgroud)
  buffer = new Buffer()

  drawScene()
}
