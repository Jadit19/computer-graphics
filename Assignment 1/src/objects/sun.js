class Sun {
  constructor () {
    this.color = [251, 230, 77]
    this.make()
  }

  make () {
    this.makeSun()
    this.makeRays()
  }

  makeSun () {
    this.main = new Circle(this.color)
    this.main.translate(-0.6, 0.82)
  }

  makeRays () {
    this.ray1 = new Square(this.color)
    this.ray1.translate(-0.6, 0.82)
    this.ray1.scaleDynamically(0.005, 0.28)

    this.ray2 = new Square(this.color)
    this.ray2.translate(-0.6, 0.82)
    this.ray2.scaleDynamically(0.005, 0.28)
    this.ray2.rotate(45)

    this.ray3 = new Square(this.color)
    this.ray3.translate(-0.6, 0.82)
    this.ray3.scaleDynamically(0.005, 0.28)
    this.ray3.rotate(90)

    this.ray4 = new Square(this.color)
    this.ray4.translate(-0.6, 0.82)
    this.ray4.scaleDynamically(0.005, 0.28)
    this.ray4.rotate(135)
  }

  animate () {
    this.ray1.rotate(1)
    this.ray2.rotate(1)
    this.ray3.rotate(1)
    this.ray4.rotate(1)
  }

  draw () {
    this.animate()
    this.ray1.draw()
    this.ray2.draw()
    this.ray3.draw()
    this.ray4.draw()
    this.main.draw()
  }
}
