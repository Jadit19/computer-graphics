class Fan extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw () {
    this.drawBase(buffer.fan.vertex, buffer.fan.index)
  }
}
