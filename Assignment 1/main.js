/** @type {Init} */
var init

/** @type {Buffer} */
var buffer

/** @type {Tree} */
var leftTree, centerTree, rightTree

/** @type {Mountain} */
var leftMountain, centerMountain, rightMountain

var color = {
  backgroud: [128, 202, 250]
}

const drawTrees = () => {
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

const drawBackground = () => {
  leftMountain.translate(-0.5, 0)
  leftMountain.scale(1.3)
  centerMountain.scale(1.9)
  centerMountain.translate(0.1, 0)
  rightMountain.translate(0.9, 0)
  rightMountain.scale(1.2)

  leftMountain.draw()
  rightMountain.draw()
  centerMountain.draw()
}

const drawScenery = () => {
  init.clear()

  drawBackground()
  drawTrees()
}

const initialize = () => {
  leftTree = new Tree()
  centerTree = new Tree()
  rightTree = new Tree()

  leftMountain = new Mountain()
  centerMountain = new Mountain()
  rightMountain = new Mountain()
}

const webGLStart = () => {
  const canvas = document.getElementById('canvas')

  init = new Init(canvas, color.backgroud)
  buffer = new Buffer()

  initialize()
  drawScenery()
}
