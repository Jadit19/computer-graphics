/** @type {Init} */
var init1, init2, init3

/** @type {Buffer} */
var buffer1, buffer2, buffer3

const drawScene = () => {
  init1.clear()
  init2.clear()
  init3.clear()
}

const webGLStart = () => {
  const canvas1 = document.getElementById('canvas1')
  const canvas2 = document.getElementById('canvas2')
  const canvas3 = document.getElementById('canvas3')

  init1 = new Init(canvas1, [212, 211, 239])
  init2 = new Init(canvas2, [239, 210, 211])
  init3 = new Init(canvas3, [212, 238, 213])

  buffer1 = new Buffer(init1.gl)
  buffer2 = new Buffer(init2.gl)
  buffer3 = new Buffer(init3.gl)

  drawScene()
}
