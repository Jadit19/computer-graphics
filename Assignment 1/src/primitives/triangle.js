class Triangle extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw () {
    this.drawBase(buffer.triangle.vertex, buffer.triangle.index)
  }
}
