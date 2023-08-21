class Tree {
  constructor () {
    this.leafColor1 = [128, 202, 95]
    this.leafColor2 = [105, 177, 90]
    this.leafColor3 = [67, 151, 85]
    this.trunkColor = [128, 58, 69]
    this.make()
  }

  make () {
    this.makeLeaves()
    this.makeTrunk()
  }

  makeLeaves () {
    this.topLeaf = new Triangle(this.leafColor1)
    this.middleLeaf = new Triangle(this.leafColor2)
    this.bottomLeaf = new Triangle(this.leafColor3)
  }

  makeTrunk () {
    this.trunk = new Square(this.trunkColor)
  }

  translate (translateX, translateY) {
    this.topLeaf.translate(translateX, translateY)
    this.middleLeaf.translate(translateX, translateY)
    this.bottomLeaf.translate(translateX, translateY)
    this.trunk.translate(translateX, translateY)
  }

  scale (scale) {
    this.topLeaf.scale(scale, scale)
    this.middleLeaf.scale(scale, scale)
    this.bottomLeaf.scale(scale, scale)
    this.trunk.scale(scale, scale)
  }

  draw () {
    this.topLeaf.translate(0, 0.5)
    this.middleLeaf.translate(0, 0.4)
    this.bottomLeaf.translate(0, 0.3)
    this.trunk.scale(0.13, 0.85)
    this.trunk.translate(0, -0.3)

    this.trunk.draw()
    this.bottomLeaf.draw()
    this.middleLeaf.draw()
    this.topLeaf.draw()
  }
}
