class Sphere extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw (buffer, init) {
    this.drawBase(buffer.sphere, init)
  }
}
