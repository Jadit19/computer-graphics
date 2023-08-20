/** @type {Init} */
var init

/** @type {Buffer} */
var buffer

const color = {
  red: [0.8, 0.0, 0.0, 1.0],
  green: [0.0, 0.8, 0.0, 1.0],
  blue: [0.0, 0.0, 0.8, 1.0]
}

const drawScene = () => {
  init.clear()
}

const webGLStart = () => {
  const canvas = document.getElementById('canvas')

  init = new Init(canvas)
  buffer = new Buffer()

  drawScene()
}
