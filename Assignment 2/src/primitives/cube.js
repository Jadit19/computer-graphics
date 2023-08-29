class Cube extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw (canvasNumber) {
    /** @type {Buffer} */
    let buffer =
      canvasNumber === 1 ? buffer1 : canvasNumber === 2 ? buffer2 : buffer3
    this.drawBase(buffer.cube.vertex, buffer.cube.index, canvasNumber)
  }
}
