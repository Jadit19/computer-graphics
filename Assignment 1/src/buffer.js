class Buffer {
  constructor () {
    this.initTriangle()
    this.initSquare()
    this.initCircle()
    this.initFan()
    this.initTrapezium()
  }

  initTriangle () {
    this.triangle = {
      vertices: null,
      vertex: null,
      indices: null,
      index: null
    }
    this.initTriangleLocations()
    this.initTriangleIndices()
  }

  initTriangleLocations () {
    this.triangle.vertices = new Float32Array([
      0.0,
      0.5,
      -Math.sqrt(3) / 4,
      -0.25,
      Math.sqrt(3) / 4,
      -0.25
    ])
    this.triangle.vertex = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ARRAY_BUFFER, this.triangle.vertex)
    init.gl.bufferData(
      init.gl.ARRAY_BUFFER,
      this.triangle.vertices,
      init.gl.STATIC_DRAW
    )
    this.triangle.vertex.itemSize = 2
    this.triangle.vertex.numItems = 3
  }

  initTriangleIndices () {
    this.triangle.indices = new Uint16Array([0, 1, 2])
    this.triangle.index = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ELEMENT_ARRAY_BUFFER, this.triangle.index)
    init.gl.bufferData(
      init.gl.ELEMENT_ARRAY_BUFFER,
      this.triangle.indices,
      init.gl.STATIC_DRAW
    )
    this.triangle.index.itemSize = 1
    this.triangle.index.numItems = 3
  }

  initSquare () {
    this.square = {
      vertices: null,
      vertex: null,
      indices: null,
      index: null
    }
    this.initSquareLocations()
    this.initSquareIndices()
  }

  initSquareLocations () {
    this.square.vertices = new Float32Array([
      0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    this.square.vertex = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ARRAY_BUFFER, this.square.vertex)
    init.gl.bufferData(
      init.gl.ARRAY_BUFFER,
      this.square.vertices,
      init.gl.STATIC_DRAW
    )
    this.square.vertex.itemSize = 2
    this.square.vertex.numItems = 4
  }

  initSquareIndices () {
    this.square.indices = new Uint16Array([0, 1, 2, 0, 2, 3])
    this.square.index = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ELEMENT_ARRAY_BUFFER, this.square.index)
    init.gl.bufferData(
      init.gl.ELEMENT_ARRAY_BUFFER,
      this.square.indices,
      init.gl.STATIC_DRAW
    )
    this.square.index.itemSize = 1
    this.square.index.numItems = 6
  }

  initCircle () {
    this.circle = {
      vertices: null,
      vertex: null,
      indices: null,
      index: null,
      segments: 30
    }
    this.initCircleLocations()
    this.initCircleIndices()
  }

  initCircleLocations () {
    const radius = 0.1
    const angleIncrements = (2 * Math.PI) / this.circle.segments
    const circleVertices = [0.0, 0.0]

    for (let i = 0; i <= this.circle.segments; i++) {
      const angle = i * angleIncrements
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      circleVertices.push(x, y)
    }

    this.circle.vertices = new Float32Array(circleVertices)
    this.circle.vertex = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ARRAY_BUFFER, this.circle.vertex)
    init.gl.bufferData(
      init.gl.ARRAY_BUFFER,
      this.circle.vertices,
      init.gl.STATIC_DRAW
    )
    this.circle.vertex.itemSize = 2
    this.circle.vertex.numItems = this.circle.segments + 2
  }

  initCircleIndices () {
    const circleIndices = []
    for (let i = 0; i <= this.circle.segments; i++) {
      circleIndices.push(0, i, i + 1)
    }

    this.circle.indices = new Uint16Array(circleIndices)
    this.circle.index = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ELEMENT_ARRAY_BUFFER, this.circle.index)
    init.gl.bufferData(
      init.gl.ELEMENT_ARRAY_BUFFER,
      this.circle.indices,
      init.gl.STATIC_DRAW
    )
    this.circle.index.itemSize = 1
    this.circle.index.numItems = (this.circle.segments + 1) * 3
  }

  initFan () {
    this.fan = {
      vertices: null,
      vertex: null,
      indices: null,
      index: null
    }
    this.initFanLocations()
    this.initFanIndices()
  }

  initFanLocations () {
    this.fan.vertices = new Float32Array([
      0.0, 0.0, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5
    ])
    this.fan.vertex = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ARRAY_BUFFER, this.fan.vertex)
    init.gl.bufferData(
      init.gl.ARRAY_BUFFER,
      this.fan.vertices,
      init.gl.STATIC_DRAW
    )
    this.fan.vertex.itemSize = 2
    this.fan.vertex.numItems = 5
  }

  initFanIndices () {
    this.fan.indices = new Uint16Array([0, 1, 2, 0, 3, 4])
    this.fan.index = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ELEMENT_ARRAY_BUFFER, this.fan.index)
    init.gl.bufferData(
      init.gl.ELEMENT_ARRAY_BUFFER,
      this.fan.indices,
      init.gl.STATIC_DRAW
    )
    this.fan.index.itemSize = 1
    this.fan.index.numItems = 6
  }

  initTrapezium () {
    this.trapezium = {
      vertices: null,
      vertex: null,
      indices: null,
      index: null
    }
    this.initTrapeziumLocations()
    this.initTrapeziumIndices()
  }

  initTrapeziumLocations () {
    this.trapezium.vertices = new Float32Array([
      -0.5, 0.5, 0.5, 0.5, 0.4, -0.5, -0.4, -0.5
    ])
    this.trapezium.vertex = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ARRAY_BUFFER, this.trapezium.vertex)
    init.gl.bufferData(
      init.gl.ARRAY_BUFFER,
      this.trapezium.vertices,
      init.gl.STATIC_DRAW
    )
    this.trapezium.vertex.itemSize = 2
    this.trapezium.vertex.numItems = 4
  }

  initTrapeziumIndices () {
    this.trapezium.indices = new Uint16Array([0, 1, 2, 0, 2, 3])
    this.trapezium.index = init.gl.createBuffer()
    init.gl.bindBuffer(init.gl.ELEMENT_ARRAY_BUFFER, this.trapezium.index)
    init.gl.bufferData(
      init.gl.ELEMENT_ARRAY_BUFFER,
      this.trapezium.indices,
      init.gl.STATIC_DRAW
    )
    this.trapezium.index.itemSize = 1
    this.trapezium.index.numItems = 6
  }
}
