class Circle extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw () {
    this.drawBase(buffer.circle.vertex, buffer.circle.index)
  }
}
