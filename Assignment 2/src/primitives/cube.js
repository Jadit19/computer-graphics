class Cube extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw (shader) {
    this.drawBase(buffer.cube, shader)
  }
}
