
import {
  Vector2
} from 'three/build/three.module'
/**
 * EdgeWork shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

var ZoomBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    delta: { value: new Vector2() },
    center: { value: new Vector2() },
    texSize: { value: new Vector2() },
    strength: { value: null }
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
    'uniform vec2 delta;',
    'uniform vec2 center;',
    'uniform vec2 texSize;',
    'uniform float strength;',
    'varying vec2 vUv;',

    'float rand(float n){return fract(sin(n) * 43758.5453123);}',


    'void main() {',
    
    'vec4 color = vec4(0.0);',
    'float total = 0.0;',
    'vec2 toCenter = center - vUv * texSize;',

    /* randomize the lookup values to hide the fixed number of samples */
    // 'float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);',
    'float offset = rand(5000.0);',

    'for (float t = 0.0; t <= 40.0; t++) {',
    'float percent = (t + offset) / 40.0;',
    'float weight = 4.0 * (percent - percent * percent);',
    'vec4 sampleColor = texture2D(tDiffuse, vUv + toCenter * percent * strength / texSize);',

    /* switch to pre-multiplied alpha to correctly blur transparent images */
    'sampleColor.rgb *= sampleColor.a;',

    'color += sampleColor * weight;',
    'total += weight;',
    '}',

    'gl_FragColor = color / total;',

    /* switch back from pre-multiplied alpha */
    'gl_FragColor.rgb /= gl_FragColor.a + 0.00001;',

    '}'
  ].join('\n')
}

export { ZoomBlurShader }
