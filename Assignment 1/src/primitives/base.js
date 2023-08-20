class PrimitiveBase {
  constructor (color) {
    this.color = [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, 1.0]
    this.setupMatrix()
  }

  setupMatrix () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)
  }

  translate (translateX, translateY) {
    this.mMatrix = mat4.translate(this.mMatrix, [translateX, translateY, 0.0])
  }

  rotate (angle) {
    this.mMatrix = mat4.rotate(
      this.mMatrix,
      (angle * Math.PI) / 180,
      [0.0, 0.0, 1.0]
    )
  }

  scale (scaleX, scaleY) {
    this.mMatrix = mat4.scale(this.mMatrix, [scaleX, scaleY, 1.0])
  }

  drawBase (vertexBuf, indexBuf) {
    init.gl.uniformMatrix4fv(init.uMMatrixLocation, false, this.mMatrix)
    init.gl.bindBuffer(init.gl.ARRAY_BUFFER, vertexBuf)
    init.gl.vertexAttribPointer(
      init.aPositionLocation,
      vertexBuf.itemSize,
      init.gl.FLOAT,
      false,
      0,
      0
    )

    init.gl.bindBuffer(init.gl.ELEMENT_ARRAY_BUFFER, indexBuf)
    init.gl.uniform4fv(init.uColorLoc, this.color)
    init.gl.drawElements(
      init.gl.TRIANGLES,
      indexBuf.numItems,
      init.gl.UNSIGNED_SHORT,
      0
    )
  }
}
