class Trapezium extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw () {
    this.drawBase(buffer.trapezium.vertex, buffer.trapezium.index)
  }
}
