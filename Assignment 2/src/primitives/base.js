class PrimitiveBase {
  constructor (color) {
    this.color = [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, 1.0]
    this.setupMatrix()
  }

  setupMatrix () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)
    this.mMatrix = mat4.rotate(this.mMatrix, 0.5, [0, 1, 0])

    this.vMatrix = mat4.create()
    mat4.identity(this.vMatrix)
    this.vMatrix = mat4.lookAt(
      [0.0, 0.0, 2.0],
      [0.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      this.vMatrix
    )

    this.pMatrix = mat4.create()
    mat4.identity(this.pMatrix)
    mat4.perspective(50, 1.0, 0.1, 1000, this.pMatrix)
  }

  drawBase (buffer, init) {
    init.gl.bindBuffer(init.gl.ARRAY_BUFFER, buffer.vertex)
    init.gl.vertexAttribPointer(
      init.aPositionLocation,
      buffer.vertex.itemSize,
      init.gl.FLOAT,
      false,
      0,
      0
    )
    init.gl.bindBuffer(init.gl.ELEMENT_ARRAY_BUFFER, buffer.index)
    init.gl.uniform4fv(init.uColorLocation, this.color)
    init.gl.uniformMatrix4fv(init.uMMatrixLocation, false, this.mMatrix)
    init.gl.uniformMatrix4fv(init.uVMatrixLocation, false, this.vMatrix)
    init.gl.uniformMatrix4fv(init.uPMatrixLocation, false, this.pMatrix)
    init.gl.drawElements(
      init.gl.LINE_LOOP,
      buffer.index.numItems,
      init.gl.UNSIGNED_SHORT,
      0
    )
  }
}
