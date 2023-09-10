class PrimitiveBase {
  constructor (color) {
    this.color = [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, 1.0]
    this.translateArray = []
    this.scaleArray = []

    this.setupMatrices()
  }

  setupMatrices () {
    this.mMatrix = mat4.create()
    mat4.identity(this.mMatrix)

    this.vMatrix = mat4.create()
    mat4.identity(this.vMatrix)
    this.vMatrix = mat4.lookAt(
      [0.0, 0.0, 2.5],
      [0.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      this.vMatrix
    )

    this.pMatrix = mat4.create()
    mat4.identity(this.pMatrix)
  }

  clear () {
    mat4.identity(this.mMatrix)
  }

  addVariables () {
    mat4.perspective(zoom, 1.0, 0.1, 1000, this.pMatrix)
    for (let i = 0; i < this.translateArray.length; i++) {
      this.mMatrix = mat4.translate(this.mMatrix, [
        this.translateArray[i][0],
        this.translateArray[i][1],
        this.translateArray[i][2]
      ])
    }
    for (let i = 0; i < this.scaleArray.length; i++) {
      this.mMatrix = mat4.scale(this.mMatrix, [
        this.scaleArray[i][0],
        this.scaleArray[i][1],
        this.scaleArray[i][2]
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

  rotateZ (degrees) {
    this.mMatrix = mat4.rotate(
      this.mMatrix,
      (degrees * Math.PI) / 180,
      [0, 0, 1]
    )
  }

  translate (translateX, translateY, translateZ) {
    this.translateArray.push([translateX, translateY, translateZ])
  }

  translateNow (translateX, translateY, translateZ) {
    this.mMatrix = mat4.translate(this.mMatrix, [
      translateX,
      translateY,
      translateZ
    ])
  }

  scale (scaleX, scaleY, scaleZ) {
    this.scaleArray.push([scaleX, scaleY, scaleZ])
  }

  drawBase (buf, shader) {
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buf.vertex)
    canvas.gl.vertexAttribPointer(
      shader.aPositionLocation,
      buf.vertex.itemSize,
      canvas.gl.FLOAT,
      false,
      0,
      0
    )
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buf.normal)
    canvas.gl.vertexAttribPointer(
      shader.aNormalLocation,
      buf.normal.itemSize,
      canvas.gl.FLOAT,
      false,
      0,
      0
    )
    canvas.gl.bindBuffer(canvas.gl.ELEMENT_ARRAY_BUFFER, buf.index)
    canvas.gl.uniform4fv(shader.uColorLocation, this.color)
    canvas.gl.uniformMatrix4fv(shader.uMMatrixLocation, false, this.mMatrix)
    canvas.gl.uniformMatrix4fv(shader.uVMatrixLocation, false, this.vMatrix)
    canvas.gl.uniformMatrix4fv(shader.uPMatrixLocation, false, this.pMatrix)
    canvas.gl.uniform3fv(shader.uLightLocation, [position, 0.0, 10.0])
    canvas.gl.drawElements(
      canvas.gl.TRIANGLES,
      buf.index.numItems,
      canvas.gl.UNSIGNED_SHORT,
      0
    )
  }
}
