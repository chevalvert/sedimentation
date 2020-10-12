/* eslint-disable dot-notation */

import Store from 'store/store'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js'
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js'


import { EdgeWorkAShader } from '../shaders/EdgeWorkAShader.js'
import { EdgeWorkBShader } from '../shaders/EdgeWorkBShader.js'
import { ZoomBlurShader } from '../shaders/ZoomBlurShader.js'




const SHADERS = {
  dotScreen: new ShaderPass(DotScreenShader),
  edgeWorkA: new ShaderPass(EdgeWorkAShader),
  edgeWorkB: new ShaderPass(EdgeWorkBShader),
  zoomBlur: new ShaderPass(ZoomBlurShader)
}



const camera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 1000)
const scene = new THREE.Scene()
const material = new THREE.MeshBasicMaterial()
const plane = new THREE.PlaneBufferGeometry(1, 1)
const planeMesh = new THREE.Mesh(plane, material)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
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

renderer.setPixelRatio(Store.postprocessing.quality.get())
renderer.setSize(window.innerWidth, window.innerHeight)

renderer.domElement.id = 'PostProcessing'
document.querySelector('main').appendChild(renderer.domElement)

const halftonePass = new HalftonePass( window.innerWidth, window.innerHeight, {disable:false} );


composer.addPass(new RenderPass(scene, camera))

//composer.addPass( halftonePass );


SHADERS.dotScreen.uniforms['tSize'].value.x = window.innerWidth
SHADERS.dotScreen.uniforms['tSize'].value.y = window.innerHeight
SHADERS.dotScreen.uniforms['scale'].value = 0.5
SHADERS.dotScreen.uniforms['angle'].value = 90
// composer.addPass(SHADERS.dotScreen)


SHADERS.zoomBlur.uniforms['center'].value.x = window.innerWidth/2
SHADERS.zoomBlur.uniforms['center'].value.y = window.innerHeight/2
SHADERS.zoomBlur.uniforms['texSize'].value.x = window.innerWidth
SHADERS.zoomBlur.uniforms['texSize'].value.y = window.innerHeight
SHADERS.zoomBlur.uniforms['strength'].value = 0.0




composer.addPass(SHADERS.edgeWorkA)

composer.addPass(SHADERS.zoomBlur)

 composer.addPass(SHADERS.edgeWorkB)




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
    /* eslint-disable dot-notation */
    // SHADERS.sobel.uniforms['resolution'].value.x = Store.postprocessing.sobelResolutionX.current

    
     SHADERS.edgeWorkA.uniforms['delta'].value = [Store.postprocessing.edgeWorkRadius.current / window.innerWidth, 0]
     SHADERS.edgeWorkB.uniforms['delta'].value = [0, Store.postprocessing.edgeWorkRadius.current / window.innerHeight]

    SHADERS.zoomBlur.uniforms['strength'].value = Store.postprocessing.blurStrength.current


    material.map.needsUpdate = true
    renderer.render(scene, camera)
    composer.render()
  }
}
