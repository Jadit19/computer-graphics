class PrimitiveBase {
  constructor (color) {
    this.color = [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, 1.0]
    this.setupMatrix()
    this.scaleFactors = []
  }

  setupMatrix () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)
  }

  translate (translateX, translateY) {
    this.mMatrix = mat4.translate(this.mMatrix, [translateX, translateY, 0.0])
  }

  rotate (angle) {
    this.mMatrix = mat4.rotateZ(this.mMatrix, (angle * Math.PI) / 180)
  }

  scale (scaleX, scaleY) {
    this.mMatrix = mat4.scale(this.mMatrix, [scaleX, scaleY, 1.0])
    this.scaleFactors.push(scaleX)
  }

  scaleWithRotate (scaleX, scaleY) {
    this.scaleFactors.push({
      x: scaleX,
      y: scaleY
    })
  }

  drawBase (vertexBuf, indexBuf) {
    for (let i = 0; i < this.scaleFactors.length; i++) {
      if (typeof this.scaleFactors[i].x === 'number') {
        this.scale(this.scaleFactors[i].x, this.scaleFactors[i].y)
      }
    }

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
      drawMode == 1
        ? init.gl.POINTS
        : drawMode == 2
        ? init.gl.LINE_LOOP
        : init.gl.TRIANGLES,
      indexBuf.numItems,
      init.gl.UNSIGNED_SHORT,
      0
    )

    for (let i = this.scaleFactors.length - 1; i >= 0; i--) {
      if (typeof this.scaleFactors[i].x === 'number') {
        this.scale(1 / this.scaleFactors[i].x, 1 / this.scaleFactors[i].y)
      }
    }
  }
}
