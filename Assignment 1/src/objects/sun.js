class Sun {
  constructor () {
    this.color = [251, 230, 77]
    this.degreesTurned = 0

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
    this.ray2 = new Square(this.color)
    this.ray3 = new Square(this.color)
    this.ray4 = new Square(this.color)
    this.ray1.translate(-0.6, 0.82)
    this.ray2.translate(-0.6, 0.82)
    this.ray3.translate(-0.6, 0.82)
    this.ray4.translate(-0.6, 0.82)
  }

  animate () {
    this.degreesTurned += 1
    this.ray1.rotate(this.degreesTurned)
    this.ray2.rotate(this.degreesTurned)
    this.ray3.rotate(this.degreesTurned)
    this.ray4.rotate(this.degreesTurned)
  }

  draw () {
    this.ray2.rotate(45)
    this.ray3.rotate(90)
    this.ray4.rotate(135)
    this.animate()
    this.ray1.scale(0.005, 0.28)
    this.ray2.scale(0.005, 0.28)
    this.ray3.scale(0.005, 0.28)
    this.ray4.scale(0.005, 0.28)

    this.ray1.draw()
    this.ray2.draw()
    this.ray3.draw()
    this.ray4.draw()
    this.main.draw()
  }
}
