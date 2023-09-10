class Sphere extends PrimitiveBase {
  constructor (color) {
    super(color)
  }

  draw (shader) {
    this.drawBase(buffer.sphere, shader)
  }
}
