
import {
  Vector2
} from 'three/build/three.module'
/**
 * EdgeWork shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

var EdgeWorkBShader = {
  uniforms: {
    tDiffuse: { value: null },
    delta: { value: new Vector2() },
    resolution: { value: new Vector2() }
  },

  vertexShader: [

    'varying vec2 vUv;',

    'void main() {',

    'vUv = uv;',

    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'
  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D tDiffuse;',
    'uniform vec2 resolution;',
    'uniform vec2 delta;',
    'varying vec2 vUv;',

    'float rand(float n){return fract(sin(n) * 43758.5453123);}',

    'void main() {',

    // 2D Random
    /*
    "float random (in vec2 st) {",
    "return fract(sin(dot(st.xy,vec2(12.9898,78.233)))* 43758.5453123);",
    "}",

    "float random(vec3 scale, float seed){",
    "return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);",
    "};",

    */

    'vec2 color = vec2(0.0);',
    'vec2 total = vec2(0.0);',

    // 'float offset = rand(vec3(12.9898, 78.233, 151.7182), 0.0);',
    'float offset = rand(5000.0);',

    'for(float t = -30.0; t <= 30.0; t++) {',
    'float percent = (t + offset - 0.5) / 30.0;',
    'float weight = 1.0 - abs(percent);',
    'vec2 sampleColor = texture2D(tDiffuse, vUv + delta * percent).xy;',

    'color.x += sampleColor.x * weight;',
    'total.x += weight;',
    'if (abs(t) < 15.0) {',
    'weight = weight * 2.0 - 1.0;',
    'color.y += sampleColor.y * weight;',
    'total.y += weight;',
    '}',
    '}',

    'float c = clamp(10000.0 * (color.y / total.y - color.x / total.x), 0.0, 1.0);',

    'gl_FragColor = vec4(c, c, c, 1.0);',

    '}'
  ].join('\n')
}

export { EdgeWorkBShader }
