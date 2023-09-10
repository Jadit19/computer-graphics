const perFaceVertexShaderCode = `#version 300 es
in vec3 aPosition;
uniform mat4 uMMatrix;
uniform mat4 uPMatrix;
uniform mat4 uVMatrix;
out mat4 vMatrix;
out vec3 posInEyeSpace;

void main() {
  mat4 projectionModelView;
  projectionModelView = uPMatrix * uVMatrix * uMMatrix;
  gl_Position = projectionModelView * vec4(aPosition, 1.0);
  posInEyeSpace = vec3(uVMatrix * uMMatrix * vec4(aPosition,1.0));
  gl_PointSize = 2.0;
  vMatrix=uVMatrix;
}`
const perFaceFragmentShaderCode = `#version 300 es
precision mediump float;
in mat4 vMatrix;
in vec3 posInEyeSpace;
out vec4 fragColor;
uniform vec4 objColor;
vec3 normal;
uniform vec3 light;
vec3 L,R,V;

void main() {
  normal = normalize(cross(dFdx(posInEyeSpace), dFdy(posInEyeSpace)));
  L = normalize(vec3(vMatrix * vec4(light, 1.0)) - posInEyeSpace);
  R = normalize(-reflect(L,normal));
  V = normalize(-posInEyeSpace);
  float diffuse = max(dot(normal,L),0.0);
  float specular = 1.0*pow(max(dot(V,R),0.0),10.0);
  float ambient = 0.5;
  fragColor = vec4(vec3((ambient+ diffuse + specular)*objColor),1.0);
}`
const gouraudVertexShaderCode = `#version 300 es
in vec3 aPosition;
in vec3 aNormal;

uniform mat4 uMMatrix;
uniform mat4 uPMatrix;
uniform mat4 uVMatrix;

out vec4 fragColor;
uniform vec3 light;
vec3 L,R,V,posInEyeSpace;
 
void main() {
  mat4 projectionModelView;
  mat3 normalTransformMatrix = mat3(uVMatrix*uMMatrix);
  vec3 normal = normalize(normalTransformMatrix*aNormal);

  projectionModelView = uPMatrix * uVMatrix * uMMatrix;
  gl_Position = projectionModelView * vec4(aPosition, 1.0);
  posInEyeSpace = vec3(uVMatrix * uMMatrix * vec4(aPosition,1.0));
  gl_PointSize = 2.0;
  L = normalize(vec3(uVMatrix * vec4(light, 1.0)) - posInEyeSpace);
  R = normalize(-reflect(L,normal));
  V = normalize(-posInEyeSpace);
  float diffuse = max(dot(normal,L),0.0);
  float specular = 1.0*pow(max(dot(V,R),0.0),10.0);
  float ambient = 0.5;
  fragColor = vec4(vec3((ambient+ diffuse + specular)),1.0);
}`
const gouraudFragmentShaderCode = `#version 300 es
precision mediump float;
in vec4 fragColor;

out vec4 Color;

uniform vec4 objColor;

void main() {
  Color = fragColor*objColor;
}`
const phongVertexShaderCode = `#version 300 es
in vec3 aPosition;
in vec3 aNormal;

out vec3 fragNormal;
out vec3 fragLightDir;
out vec3 fragViewDir;

uniform mat4 uMMatrix;
uniform mat4 uPMatrix;
uniform mat4 uVMatrix;
uniform vec3 light;

out vec4 FragColor;

void main() {
  vec4 viewPos = uVMatrix * uMMatrix * vec4(aPosition, 1.0);
  vec4 viewNormal = uVMatrix * uMMatrix * vec4(aNormal, 0.0);
  vec3 viewLightDir = normalize(light - viewPos.xyz);
  vec3 viewViewDir = normalize(-viewPos.xyz);

  fragNormal = normalize(viewNormal.xyz);
  fragLightDir = viewLightDir;
  fragViewDir = viewViewDir;

  gl_Position = uPMatrix * viewPos;
}`
const phongFragmentShaderCode = `#version 300 es
precision mediump float;
in vec3 fragNormal;
in vec3 fragLightDir;
in vec3 fragViewDir;

out vec4 FragColor;

uniform vec4 objColor; // Object color
const vec3 ambientColor = vec3(0.4, 0.4, 0.4);
const vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
const vec3 specularColor = vec3(1.0, 1.0, 1.0);
const float shininess = 32.0;

void main() {
  vec3 N = normalize(fragNormal);
  vec3 L = normalize(fragLightDir);
  vec3 V = normalize(fragViewDir);
  vec3 R = reflect(-L, N);

  vec3 ambient = ambientColor * objColor.rgb;
  vec3 diffuse = max(dot(N, L), 0.0) * diffuseColor * objColor.rgb;
  vec3 specular = pow(max(dot(R, V), 0.0), shininess) * specularColor;

  vec3 finalColor = ambient + diffuse + specular;
  FragColor = vec4(finalColor, objColor.a);
}`

class Shader {
  constructor (type) {
    this.type = type
    this.number = type === 'face' ? 1 : this.type === 'vertex' ? 2 : 3

    this.setup()
  }

  setup () {
    this.program = canvas.gl.createProgram()
    this.setupVertexShader()
    this.setupFragmentShader()

    canvas.gl.linkProgram(this.program)
    if (!canvas.gl.getProgramParameter(this.program, canvas.gl.LINK_STATUS)) {
      console.error(canvas.gl.getShaderInfoLog())
    }

    this.setupLocations()
  }

  setupVertexShader () {
    this.vertex = canvas.gl.createShader(canvas.gl.VERTEX_SHADER)
    this.vertexCode =
      this.number === 1
        ? perFaceVertexShaderCode
        : this.number === 2
        ? gouraudVertexShaderCode
        : phongVertexShaderCode
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
    this.fragmentCode =
      this.number === 1
        ? perFaceFragmentShaderCode
        : this.number === 2
        ? gouraudFragmentShaderCode
        : phongFragmentShaderCode
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
    this.aPositionLocation = canvas.gl.getAttribLocation(
      this.program,
      'aPosition'
    )
    this.aNormalLocation = canvas.gl.getAttribLocation(this.program, 'aNormal')
    this.uMMatrixLocation = canvas.gl.getUniformLocation(
      this.program,
      'uMMatrix'
    )
    this.uVMatrixLocation = canvas.gl.getUniformLocation(
      this.program,
      'uVMatrix'
    )
    this.uPMatrixLocation = canvas.gl.getUniformLocation(
      this.program,
      'uPMatrix'
    )
    this.uLightLocation = canvas.gl.getUniformLocation(this.program, 'light')
    this.uColorLocation = canvas.gl.getUniformLocation(this.program, 'objColor')
  }

  use () {
    canvas.gl.enableVertexAttribArray(this.aPositionLocation)
    canvas.gl.enableVertexAttribArray(this.aNormalLocation)
    canvas.gl.useProgram(this.program)
  }
}
