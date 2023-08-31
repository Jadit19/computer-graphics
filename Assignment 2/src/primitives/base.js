class PrimitiveBase {
  constructor (color) {
    this.color = [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, 1.0]
    this.setupMatrix()

    this.translateArray = []
  }

  setupMatrix () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)

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
  }

  clearAll () {
    mat4.identity(this.mMatrix)
  }

  addPerspective () {
    mat4.perspective(zoom, 1.0, 0.1, 1000, this.pMatrix)
    for (let i = 0; i < this.translateArray.length; i++) {
      this.mMatrix = mat4.translate(this.mMatrix, [
        this.translateArray[i][0],
        this.translateArray[i][1],
        this.translateArray[i][2]
      ])
    }
  }

  rotateX (degrees) {
    this.mMatrix = mat4.rotate(
      this.mMatrix,
      (degrees * Math.PI) / 180,
      [1, 0, 0]
    )
  }

  rotateY (degrees) {
    this.mMatrix = mat4.rotate(
      this.mMatrix,
      (degrees * Math.PI) / 180,
      [0, 1, 0]
    )
  }

  translate (translateX, translateY, translateZ) {
    this.translateArray.push([translateX, translateY, translateZ])
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
      drawMode === 1
        ? init.gl.POINTS
        : drawMode === 2
        ? init.gl.LINE_LOOP
        : init.gl.TRIANGLES,
      buffer.index.numItems,
      init.gl.UNSIGNED_SHORT,
      0
    )
  }
}
