/** @type {Canvas} */
var canvas1, canvas2, canvas3

const drawScene = () => {
  canvas1.draw()
  canvas2.draw()
  canvas3.draw()
}

const webGLStart = () => {
  canvas1 = new Canvas('canvas1', [212, 211, 239])
  canvas2 = new Canvas('canvas2', [239, 210, 211])
  canvas3 = new Canvas('canvas3', [212, 238, 213])

  drawScene()
}
