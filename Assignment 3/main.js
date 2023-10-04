/** @type {WebGLRenderingContext} */
var gl

const initGL = () => {
  const canvas = document.getElementById('canvas')
  try {
    gl = canvas.getContext('webgl')
    gl.viewportWidth = canvas.width
    gl.viewportHeight = canvas.height
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
  } catch (e) {
    console.log(e)
  } finally {
    if (!gl) {
      alert('[ERROR] WebGL initialization failed!')
    }
    return
  }
}

const drawScene = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

const webGLStart = () => {
  initGL()

  drawScene()
}
