class Cube extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw (buffer, init) {
    this.drawBase(buffer.cube, init)
  }
}
