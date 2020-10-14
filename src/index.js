import Store from 'store/store'
import { debounce } from 'tiny-throttle'

import Animation from 'controllers/animation'
import Midi from 'controllers/midi'
import PostProcessing from 'controllers/post-processing'
import Raf from 'controllers/raf'
import Scene from 'controllers/scene'
import Sound from 'controllers/sound'
import Tweakpane from 'controllers/tweakpane'

window.onresize = debounce(() => {
  Store.scene.dimensions.set([window.innerWidth, window.innerHeight])
}, 10)

window.onload = () => {
  window.onresize()
  document.body.classList.remove('is-loading')
  Store.raf.isRunning.set(true)
}

Midi.register(Store.seed, { cc: 18, update: v => Date.now() })
Midi.register(Store.creature.scaleX, { cc: 16 })
Midi.register(Store.creature.scaleY, { cc: 17 })
Midi.register(Store.postprocessing.edgeWorkRadius, { cc: 19, update: v => 5 + v * 500 })
Midi.register(Store.postprocessing.blurStrength, { cc: 20, update: v => 0 + v * 2 })
Midi.register(Store.scene.zoom, { cc: 0, update: v => 2 + v * 8 })
Midi.register(Store.creature.density, { cc: 1, update: v => 10 + v * 190 })
Midi.register(Store.lerp.plane, { cc: 2 })
Midi.register(Store.lerp.build, { cc: 3 })
Midi.register(Store.scene.bgColor, { cc: 4, update: v => 0 + v * 360 })
Midi.register(Store.scene.bgImage, { cc: 5, update: v => Math.floor(0 + v * 27) })
Midi.register(Store.scene.rotationSpeedX, { cc: 21 })
Midi.register(Store.scene.rotationSpeedY, { cc: 22 })
Midi.register(Store.scene.rotationSpeedZ, { cc: 23 })



Tweakpane.register(Store.sound.isPlaying, 'son')
Tweakpane.register(Store.demo, 'démo')
Tweakpane.register(Store.postprocessing.enabled, 'post-process')
Tweakpane.register(Store.seed, 'générer')
Tweakpane.register(Store.postprocessing.edgeWorkRadius, 'edgeWork Radius', { min: 5, max: 500})
Tweakpane.register(Store.postprocessing.blurStrength, 'blur Strength', { min: 0, max: 2})
Tweakpane.register(Store.creature.scaleX, 'échelle x', { min: 0, max: 1 })
Tweakpane.register(Store.creature.scaleY, 'échelle y', { min: 0, max: 1 })
Tweakpane.register(Store.scene.zoom, 'zoom', { min: 2, max: 10 })
Tweakpane.register(Store.creature.density, 'densité', { min: 10, max: 200, step: 1 })
Tweakpane.register(Store.lerp.plane, 'sédimentation', { min: 0, max: 1 })
Tweakpane.register(Store.lerp.build, 'construction', { min: 0, max: 1 })
Tweakpane.register(Store.scene.bgColor, 'Couleur fond', { min: 0, max: 360, step: 1 })
Tweakpane.register(Store.scene.bgImage, 'Image fond', { min: 0, max: 27, step: 1})
Tweakpane.register(Store.scene.rotationSpeedX, 'rotation X', { min: 0, max: 1 })
Tweakpane.register(Store.scene.rotationSpeedY, 'rotation Y', { min: 0, max: 1 })
Tweakpane.register(Store.scene.rotationSpeedZ, 'rotation Z', { min: 0, max: 1 })

PostProcessing.register(Scene.canvas)

Raf.add(() => {
  if (!window.ENV.production) {
    document.title = `${window.ENV.pageTitle} | [${Store.raf.fps.current.toFixed(0)} fps]`
  }

  if (Store.demo.get()) {
    const t = Math.sin(Date.now() / 1000) + 1
    Store.lerp.plane.set(Math.min(t, 1))
    Store.lerp.build.set(Math.max(1, t) - 1)
  }

  Animation.update()
  Scene.render()

  if (Store.postprocessing.enabled.get()) PostProcessing.render()
})
