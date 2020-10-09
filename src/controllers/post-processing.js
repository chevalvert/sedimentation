/* eslint-disable dot-notation */

import Store from 'store/store'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js'
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js'
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js'
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js'

const SHADERS = {
  sobel: new ShaderPass(SobelOperatorShader),
  verticalBlur: new ShaderPass(VerticalBlurShader),
  horizontalBlur: new ShaderPass(HorizontalBlurShader),
  dotScreen: new ShaderPass(DotScreenShader)
}

const camera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 1000)
const scene = new THREE.Scene()
const material = new THREE.MeshBasicMaterial()
const plane = new THREE.PlaneBufferGeometry(1, 1)
const planeMesh = new THREE.Mesh(plane, material)
const renderer = new THREE.WebGLRenderer({ antialias: true })
const composer = new EffectComposer(renderer)

camera.position.z = 600
scene.add(planeMesh)

Store.scene.dimensions.subscribe(([width, height]) => {
  camera.aspect = width / height
  camera.left = width / -2
  camera.right = width / 2
  camera.top = height / 2
  camera.bottom = height / -2
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)

  planeMesh.scale.set(width, height, 1)
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.domElement.id = 'PostProcessing'
document.querySelector('main').appendChild(renderer.domElement)

composer.addPass(new RenderPass(scene, camera))

SHADERS.sobel.uniforms['resolution'].value.x = 300 * window.devicePixelRatio
SHADERS.sobel.uniforms['resolution'].value.y = 400 * window.devicePixelRatio
composer.addPass(SHADERS.sobel)

SHADERS.verticalBlur.uniforms['v'].value = 0.0025
composer.addPass(SHADERS.verticalBlur)

SHADERS.horizontalBlur.uniforms['h'].value = 0.002
composer.addPass(SHADERS.horizontalBlur)

SHADERS.dotScreen.uniforms['tSize'].value.x = 5
SHADERS.dotScreen.uniforms['tSize'].value.y = 5
SHADERS.dotScreen.uniforms['scale'].value = 25
SHADERS.dotScreen.uniforms['angle'].value = 90
composer.addPass(SHADERS.dotScreen)

toggleCanvas(Store.postprocessing.enabled.get())
Store.postprocessing.enabled.subscribe(toggleCanvas)
function toggleCanvas (enabled = true) {
  renderer.domElement.style.display = enabled ? '' : 'none'
}

export default {
  get SHADERS () { return SHADERS },

  register: canvas => {
    material.map = new THREE.CanvasTexture(canvas)
  },

  render: function () {
    material.map.needsUpdate = true
    renderer.render(scene, camera)
    composer.render()
  }
}
