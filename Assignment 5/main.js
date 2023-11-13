const shaderCode = {
  vertex: `#version 300 es

    in vec3 aPosition;

    out vec3 vPosition;

    void main() {
      vPosition = aPosition;
      gl_Position = vec4(aPosition, 1.0);
    }
  `,
  fragment: `#version 300 es
    #define NUM_SPHERES 4
    #define INFINITY 100000.0

    precision mediump float;
    
    in vec3 vPosition;
    uniform float lightPosition;
    uniform int bounces;

    out vec4 fragColor;
    
    struct Sphere {
      vec3 center;
      float radius;
      vec3 color;
    };

    struct Ray {
      vec3 origin;
      vec3 direction;
    };

    struct Light {
      vec3 position;
      float ambience;
      vec3 specular;
      vec3 diffuse;
    };

    struct RayTracerOutput {
      Ray reflectedRay;
      vec3 color;
    };

    Sphere spheres[NUM_SPHERES];
    Ray rays[1];
    Light light[1];

    float epsilon = 0.001;

    void initialize() {
      float x = vPosition.x;
      float y = vPosition.y;
      float z = vPosition.z;
      float focalLength = 2.0;
      vec3 color = vec3(0.0, 0.0, 0.0);
  
      // Create spheres
      spheres[0].center = vec3(-4.0,0.0,0.1);
      spheres[0].radius = 2.0;
      spheres[0].color = vec3(1.0, 0.0, 0.0);
  
      spheres[1].center = vec3(4.0,0.0,0.1);
      spheres[1].radius = 2.0;
      spheres[1].color = vec3(0.0, 1.0, 0.0);
  
      spheres[2].center = vec3(0.0, 0.0, -0.8);
      spheres[2].radius = 2.0;
      spheres[2].color = vec3(0.0, 0.0, 1.0);
  
      spheres[3].center = vec3(0.0,-11.0 , 0.0);
      spheres[3].radius = 9.0;
      spheres[3].color = vec3(1.0, 1.0, 1.0);
  
      // Create ray
      vec2 screenPos = gl_FragCoord.xy/vec2(800, 800);
      rays[0].origin = vec3(0.0, 0.0, 5.0);
      rays[0].direction = normalize(vec3(screenPos*2.0 - 1.0, -1.0));
  
      // Create Light source
      light[0].position = vec3(lightPosition, 1.0, 1.0);
      light[0].ambience = 0.6;
    }

    float getIntersection(Sphere sphere, Ray ray) {
      vec3 sphereCenter = sphere.center;
      vec3 colorOfSphere = sphere.color;
      float radius = sphere.radius;
      vec3 cameraSource = ray.origin;
      vec3 cameraDirection = ray.direction;
  
      vec3 distanceFromCenter = (cameraSource - sphereCenter);
      float B = 2.0 * dot(cameraDirection, distanceFromCenter);
      float C = dot(distanceFromCenter, distanceFromCenter) - pow(radius, 2.0);
      float delta = pow(B, 2.0) - 4.0 * C;
      float t = 0.0;
      if (delta > 0.0) {
          float sqRoot = sqrt(delta);
          float t1 = (-B + sqRoot) / 2.0;
          float t2 = (-B - sqRoot) / 2.0;
          t = min(t1, t2);
      }
      if (delta == 0.0) {
          t = -B / 2.0;
      }
      return t;
    }

    RayTracerOutput trace(Sphere spheres[NUM_SPHERES], Ray ray, Light light) {
      RayTracerOutput rayTracer;
      Ray reflectionRay;
      Sphere sphereToShow;
      float minT = INFINITY;
      vec3 cameraSource = ray.origin;
      vec3 cameraDirection = ray.direction;
      vec3 lightSource = light.position;
      float ambience = light.ambience;
      vec3 color = vec3(0.0, 0.0, 0.0);
  
      for (int i=0; i < NUM_SPHERES; i++) {
        float t = getIntersection(spheres[i], ray);
        if (t > 0.0 && t < minT) {
          minT = t;
          sphereToShow = spheres[i];
        }
      }
  
      vec3 sphereCenter = sphereToShow.center;
      vec3 colorOfSphere = sphereToShow.color;
  
      if (minT > 0.0 && minT != INFINITY) {
        vec3 surfacePoint = cameraSource + (minT * cameraDirection);
        vec3 surfaceNormal = normalize(surfacePoint - sphereCenter);

        // Reflection
        vec3 reflection = 2.0 * dot(-ray.direction, surfaceNormal) * surfaceNormal + ray.direction;
        reflectionRay.origin = surfaceNormal + epsilon * reflection;
        reflectionRay.direction = reflection;
        color = colorOfSphere * (ambience + ((1.0 - ambience) * max(0.0, dot(surfaceNormal, lightSource))));
        rayTracer.color = color;
        rayTracer.reflectedRay = reflectionRay;
      }
      return rayTracer;
    }

    void main() {
      initialize();

      RayTracerOutput rayTracer = trace(spheres, rays[0], light[0]);
      fragColor = vec4(rayTracer.color, 1.0);
      
      for (int i=0; i<bounces; i++){
        rayTracer = trace(spheres, rayTracer.reflectedRay, light[0]);
        fragColor.rgb += 0.3 * rayTracer.color;
      }
    }
  `
}

/** @type {Canvas} */
var canvas

/** @type {Inputs} */
var inputs

/** @type {Scene} */
var scene

class Canvas {
  constructor (id) {
    this.element = document.getElementById(id)

    this.init()
  }

  init () {
    try {
      /** @type {WebGL2RenderingContext} */
      this.gl = this.element.getContext('webgl2')
      this.gl.viewportWidth = this.element.width
      this.gl.viewportHeight = this.element.height
      this.gl.enable(this.gl.DEPTH_TEST)
      this.gl.enable(this.gl.SCISSOR_TEST)
    } catch (e) {
      console.error(e)
    } finally {
      if (!this.gl) {
        alert('[ERROR] WebGL initialization failed!')
      }
    }
  }

  clear () {
    this.gl.clearColor(0.9, 0.9, 0.9, 1.0)
    this.gl.viewport(0, 0, this.element.width, this.element.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }
}

class Shader {
  constructor (vertexCode, fragmentCode) {
    this.vertexCode = vertexCode
    this.fragmentCode = fragmentCode

    this.init()
  }

  init () {
    this.program = canvas.gl.createProgram()
    this.setupVertexShader()
    this.setupFragmentShader()
    canvas.gl.linkProgram(this.program)
    if (!canvas.gl.getProgramParameter(this.program, canvas.gl.LINK_STATUS)) {
      console.error(canvas.gl.getProgramInfoLog(this.program))
    }
    this.setupLocations()
    canvas.gl.useProgram(this.program)
  }

  setupVertexShader () {
    this.vertex = canvas.gl.createShader(canvas.gl.VERTEX_SHADER)
    canvas.gl.shaderSource(this.vertex, this.vertexCode)
    canvas.gl.compileShader(this.vertex)
    if (!canvas.gl.getShaderParameter(this.vertex, canvas.gl.COMPILE_STATUS)) {
      alert('[ERROR] Vertex shader not compiled!')
      console.error(canvas.gl.getShaderInfoLog(this.vertex))
    }
    canvas.gl.attachShader(this.program, this.vertex)
  }

  setupFragmentShader () {
    this.fragment = canvas.gl.createShader(canvas.gl.FRAGMENT_SHADER)
    canvas.gl.shaderSource(this.fragment, this.fragmentCode)
    canvas.gl.compileShader(this.fragment)
    if (
      !canvas.gl.getShaderParameter(this.fragment, canvas.gl.COMPILE_STATUS)
    ) {
      alert('[ERROR] Fragment shader not compiled!')
      console.error(canvas.gl.getShaderInfoLog(this.fragment))
    }
    canvas.gl.attachShader(this.program, this.fragment)
  }

  setupLocations () {
    this.locations = {
      aPosition: canvas.gl.getAttribLocation(this.program, 'aPosition'),
      light: canvas.gl.getUniformLocation(this.program, 'lightPosition'),
      bounces: canvas.gl.getUniformLocation(this.program, 'bounces')
    }
  }
}

class Buffer {
  constructor () {
    this.setupPosition()
  }

  setupPosition () {
    this.vertex = canvas.gl.createBuffer()
    const vertexData = new Float32Array([
      -1, 1, 0, 1, 1, 0, -1, -1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0
    ])

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.vertex)
    canvas.gl.bufferData(
      canvas.gl.ARRAY_BUFFER,
      vertexData,
      canvas.gl.STATIC_DRAW
    )
  }
}

class Inputs {
  constructor () {
    this.setupMode()
    this.setupLight()
    this.setupBounces()
  }

  setupMode () {
    this.mode = 0.0
    document.getElementById('mode-none').addEventListener('click', () => {
      this.mode = 0.0
      this.bounces = 0
      scene.draw()
    })
    document.getElementById('mode-shadow').addEventListener('click', () => {
      this.mode = 1.0
      this.bounces = 0
      scene.draw()
    })
    document.getElementById('mode-reflection').addEventListener('click', () => {
      this.mode = 2.0
      scene.draw()
    })
    document.getElementById('mode-both').addEventListener('click', () => {
      this.mode = 3.0
      scene.draw()
    })
  }

  setupLight () {
    this.light = 0.0
    document.getElementById('light').addEventListener('input', e => {
      this.light = e.target.value * 5.0
      scene.draw()
    })
  }

  setupBounces () {
    this.bounces = 0
    document.getElementById('bounces').addEventListener('input', e => {
      this.bounces = e.target.value
      if (this.mode == 0.0) {
        document.getElementById('mode-reflection').click()
      } else if (this.mode == 1.0) {
        document.getElementById('mode-both').click()
      }
      scene.draw()
    })
  }
}

class Scene {
  constructor () {
    this.init()
  }

  init () {
    this.shader = new Shader(shaderCode.vertex, shaderCode.fragment)
    this.buffer = new Buffer()
  }

  draw () {
    canvas.clear()

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, this.buffer.vertex)
    canvas.gl.vertexAttribPointer(
      this.shader.locations.aPosition,
      3,
      canvas.gl.FLOAT,
      false,
      0,
      0
    )
    canvas.gl.enableVertexAttribArray(this.shader.locations.aPosition)

    canvas.gl.uniform1f(this.shader.locations.light, inputs.light)
    canvas.gl.uniform1i(this.shader.locations.bounces, inputs.bounces)

    canvas.gl.drawArrays(canvas.gl.TRIANGLES, 0, 6)
  }
}

const initialize = () => {
  canvas = new Canvas('canvas')
  inputs = new Inputs()
  scene = new Scene()
}

const webGLStart = () => {
  initialize()
  scene.draw()
}
