class Square extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw () {
    this.drawBase(buffer.square.vertex, buffer.square.index)
  }
}
