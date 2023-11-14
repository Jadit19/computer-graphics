const shaderCode = {
  vertex: `#version 300 es

    in vec3 aPosition;

    void main() {
      gl_Position = vec4(aPosition, 1.0);
    }
  `,
  fragment: `#version 300 es
    #define NUM_SPHERES 4
    #define INFINITY 100000.0

    precision mediump float;

    uniform float uLight;
    uniform int uMode;
    uniform int uBounces;

    vec3 initialLightDir;

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

    Sphere spheres[NUM_SPHERES] = Sphere[NUM_SPHERES](
      Sphere(vec3(-1.8, 0, -2), 1.2, vec3(0.0, 1.0, 0.0)),  // Sphere 1
      Sphere(vec3(0.0, 0.5, -5), 2.3, vec3(1.0, 0.0, 0.0)),   // Sphere 2
      Sphere(vec3(1.8, 0, -2), 1.3, vec3(0.0, 0.0, 1.0)),      // Sphere 3
      Sphere(vec3(0, -21.5, 2), 20.0, vec3(1.0, 1.0, 1.0))    // Sphere 4
    );

    float shine[4] = float[4](20.0, 10.0, 50.0, 100.0);

    // Function to solve the quadratic equation
    bool solveQuadratic(float a, float b, float c, out float t0, out float t1) {
      float disc = b*b - 4.*a*c;
      if (disc < 0.0){
        return false;
      } else if (disc == 0.0){
        t0 = t1 = -0.5 * b / a;
        return true;
      }

      t0 = (-b + sqrt(disc)) / (2. * a);
      t1 = (-b - sqrt(disc)) / (2. * a);
      return true;
    }

    // Function to perform ray-sphere intersection
    float trace(Ray ray, Sphere sphere, out vec3 normal) {
      float a = dot(ray.direction,ray.direction);
      float b = 2.0 * dot(ray.direction, ray.origin - sphere.center);
      float c = dot(ray.origin - sphere.center, ray.origin - sphere.center) - sphere.radius * sphere.radius;
      float t0, t1;

      if (!solveQuadratic(a, b, c, t0, t1)) {
        return -1.0;
      }
      if (t0 > t1) {
        float temp = t0;
        t0 = t1;
        t1 = temp;
      }
      if (t0 < 0.0) {
        t0 = t1;
        if (t0 < 0.0) {
          return -1.0;
        }
      }

      float t = t0;
      vec3 hitPoint = ray.origin + ray.direction * t;
      normal = normalize(hitPoint - sphere.center);
      return t;
    }

    // Function to calculate lighting for phong shading
    vec3 calcLighting(vec3 normal, vec3 viewDir, vec3 lightDir, vec3 objectColor, float shininess) {
      vec3 ambient = 0.4 * objectColor;
      vec3 diffuse = 0.2 * objectColor * max(dot(normal, lightDir), 0.0);
      vec3 reflectDir = reflect(-lightDir, normal);
      vec3 specular = 0.5 * vec3(1.0, 1.0, 1.0) * pow(max(dot(viewDir, reflectDir), 0.0), shininess);
      return (ambient + diffuse + specular);
    }

    // Check whether the object is in shadow
    bool inShadow(vec3 hitPoint, vec3 lightDir) {
      vec3 normal;
      for (int i=0; i < NUM_SPHERES; i++) {
        float t = trace(Ray(hitPoint, lightDir), spheres[i], normal);
        if (t > 0.1) {
          return true;
        }
      }
      return false;
    }

    // Function to perform reflection
    void reflection(Ray ray, vec3 normal, int depth, out vec3 reflectedColor) {
      // vec3 reflectedDir = reflect(ray.direction, normal);
      // vec3 reflectedDir = 2.0 * dot(-ray.direction, normal) * normal + ray.direction;
      vec3 reflectedDir = ray.direction;
      Ray reflectedRay = ray;

      vec3 finalColor = vec3(0.0);
      vec3 currentColor = vec3(1.0);

      for (int i=0; i<uBounces; i++){
        float closestIntersection = -1.0;
        vec3 closestNormal = vec3(0.0);
        int hitSphereIndex = -1;

        // Find the closest intersection for the reflected ray
        for (int j=0; j<NUM_SPHERES; j++){
          float t = trace(reflectedRay, spheres[j], closestNormal);
          if (t > 0.01 && (closestIntersection < 0.0 || t < closestIntersection)) {
            closestIntersection = t;
            closestNormal = closestNormal;
            hitSphereIndex = j;
          }
        }

        // If there's no intersection, set background color
        if (closestIntersection < 0.0){
          reflectedColor = finalColor;
          return;
        } else {
          vec3 objectColor = spheres[hitSphereIndex].color;
          float shininess = shine[hitSphereIndex];

          // Calculate lighting
          vec3 viewDir = normalize(-reflectedRay.direction);
          vec3 point = reflectedRay.origin + closestIntersection * reflectedRay.direction;
          vec3 lightDir = normalize(initialLightDir - point);
          point = point - 0.001 * closestNormal;

          // Calculate final color
          vec3 phongColor = calcLighting(closestNormal, viewDir, lightDir, objectColor, shininess);
          finalColor += currentColor * phongColor;

          // Update the reflected ray for the next iteration
          reflectedRay.origin = point - 0.01*closestNormal;
          reflectedRay.direction = reflect(reflectedRay.direction, closestNormal);

          // Update current color with object color for the next iteration
          currentColor += objectColor;
          currentColor = normalize(currentColor);
        }
      }

      reflectedColor = finalColor;
    }

    // Function to shade a pixel
    vec4 shade(Ray ray){
      vec3 normal;
      vec3 finalColor = vec3(0.0);

      float closestIntersection = -1.0;
      vec3 closestNormal = vec3(0.0);

      // Find the closest intersection
      for (int i = 0; i < NUM_SPHERES; ++i) {
        float t = trace(ray, spheres[i], normal);
        if (t > 0.0 && (closestIntersection < 0.0 || t < closestIntersection)) {
          closestIntersection = t;
          closestNormal = normal; 
        }
      }

      // If no intersection is there, set the background color
      if (closestIntersection < 0.0){
        return vec4(0.0, 0.0, 0.0, 1.0);
      }

      vec3 objectColor = spheres[0].color;
      float shininess = shine[0];

      // Find the color of the intersected sphere
      for (int i=0; i<NUM_SPHERES; i++){
        if (closestIntersection == trace(ray, spheres[i], normal)) {
          objectColor = spheres[i].color;
          shininess = shine[i];
          break;
        }
      }

      vec3 viewDir = normalize(-ray.direction);
      vec3 point = ray.origin + closestIntersection * ray.direction;
      vec3 lightDir = normalize(initialLightDir - point);
      vec3 newOrigin = point + 0.0002*normal;

      // Check if the new origin is in shadow or not
      bool isShadowed = inShadow(newOrigin, lightDir);

      if (isShadowed && (uMode == 1 || uMode == 3)) {
        return vec4(0.2, 0.2, 0.2, 1.0);
      }

      vec3 phongColor = calcLighting(closestNormal, viewDir, lightDir, objectColor, shininess);

      // Adding environment reflection using ray tracing
      vec3 reflectedDir = reflect(ray.direction, closestNormal);
      Ray reflectedRay = Ray(newOrigin, reflectedDir);
      vec3 reflectedColor = vec3(0.0);

      // Making reflection
      reflection(reflectedRay, closestNormal, 0, reflectedColor);

      if (uMode > 1){
        phongColor += 0.8 * reflectedColor;
      }

      finalColor = phongColor;
      return vec4(finalColor, 1.0);
    }

    void main() {
      vec2 screenCoords = (gl_FragCoord.xy / vec2(800, 800)) * 2.0 - 1.0;
      initialLightDir = vec3(uLight, 5.0, -2.0);
      
      vec3 rayDirection = normalize(vec3(screenCoords, -1.0));
      vec3 rayOrigin = vec3(0.0, 0.1, 1);
      Ray primaryRay = Ray(rayOrigin, rayDirection);

      fragColor = shade(primaryRay);
    }
  `
}

/** @type {Canvas} */
var canvas

/** @type {Shader} */
var shader

/** @type {Buffer} */
var buffer

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
      uLight: canvas.gl.getUniformLocation(this.program, 'uLight'),
      uMode: canvas.gl.getUniformLocation(this.program, 'uMode'),
      uBounces: canvas.gl.getUniformLocation(this.program, 'uBounces')
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
    this.mode = 0
    document.getElementById('mode-none').addEventListener('click', () => {
      this.mode = 0
      scene.draw()
    })
    document.getElementById('mode-shadow').addEventListener('click', () => {
      this.mode = 1
      scene.draw()
    })
    document.getElementById('mode-reflection').addEventListener('click', () => {
      this.mode = 2
      scene.draw()
    })
    document.getElementById('mode-both').addEventListener('click', () => {
      this.mode = 3
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
    this.bounces = 1
    document.getElementById('bounces').addEventListener('input', e => {
      this.bounces = e.target.value
    })
  }
}

class Scene {
  constructor () {}

  draw () {
    canvas.clear()

    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buffer.vertex)
    canvas.gl.vertexAttribPointer(
      shader.locations.aPosition,
      3,
      canvas.gl.FLOAT,
      false,
      0,
      0
    )
    canvas.gl.enableVertexAttribArray(shader.locations.aPosition)

    canvas.gl.uniform1f(shader.locations.uLight, inputs.light)
    canvas.gl.uniform1i(shader.locations.uMode, inputs.mode)
    canvas.gl.uniform1i(shader.locations.uBounces, inputs.bounces)

    canvas.gl.drawArrays(canvas.gl.TRIANGLES, 0, 6)
  }
}

const initialize = () => {
  canvas = new Canvas('canvas')
  shader = new Shader(shaderCode.vertex, shaderCode.fragment)
  buffer = new Buffer()
  inputs = new Inputs()
  scene = new Scene()
}

const webGLStart = () => {
  initialize()
  scene.draw()
}
