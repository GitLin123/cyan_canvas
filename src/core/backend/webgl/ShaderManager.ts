// ============ Shader 源码 ============

const SOLID_VERT = `
attribute vec2 a_position;
uniform mat4 u_matrix;
uniform mat4 u_projection;
void main() {
  gl_Position = u_projection * u_matrix * vec4(a_position, 0.0, 1.0);
}
`;

const SOLID_FRAG = `
precision mediump float;
uniform vec4 u_color;
uniform float u_alpha;
void main() {
  gl_FragColor = u_color * u_alpha;
}
`;

const TEXTURE_VERT = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform mat4 u_matrix;
uniform mat4 u_projection;
varying vec2 v_texCoord;
void main() {
  gl_Position = u_projection * u_matrix * vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

const TEXTURE_FRAG = `
precision mediump float;
uniform sampler2D u_texture;
uniform float u_alpha;
varying vec2 v_texCoord;
void main() {
  gl_FragColor = texture2D(u_texture, v_texCoord) * u_alpha;
}
`;

export interface ShaderProgram {
  program: WebGLProgram;
  attributes: Record<string, number>;
  uniforms: Record<string, WebGLUniformLocation>;
}

export class ShaderManager {
  public solid!: ShaderProgram;
  public texture!: ShaderProgram;

  constructor(private gl: WebGLRenderingContext) {
    this.solid = this._createProgram(SOLID_VERT, SOLID_FRAG,
      ['a_position'], ['u_matrix', 'u_projection', 'u_color', 'u_alpha']);
    this.texture = this._createProgram(TEXTURE_VERT, TEXTURE_FRAG,
      ['a_position', 'a_texCoord'], ['u_matrix', 'u_projection', 'u_texture', 'u_alpha']);
  }

  private _compile(type: number, source: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compile error: ${info}`);
    }
    return shader;
  }

  private _createProgram(
    vertSrc: string, fragSrc: string,
    attrNames: string[], uniformNames: string[]
  ): ShaderProgram {
    const gl = this.gl;
    const vert = this._compile(gl.VERTEX_SHADER, vertSrc);
    const frag = this._compile(gl.FRAGMENT_SHADER, fragSrc);
    const program = gl.createProgram()!;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw new Error(`Program link error: ${info}`);
    }
    gl.deleteShader(vert);
    gl.deleteShader(frag);

    const attributes: Record<string, number> = {};
    for (const name of attrNames) {
      attributes[name] = gl.getAttribLocation(program, name);
    }
    const uniforms: Record<string, WebGLUniformLocation> = {};
    for (const name of uniformNames) {
      uniforms[name] = gl.getUniformLocation(program, name)!;
    }
    return { program, attributes, uniforms };
  }

  dispose(): void {
    const gl = this.gl;
    gl.deleteProgram(this.solid.program);
    gl.deleteProgram(this.texture.program);
  }
}
