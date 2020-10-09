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
Midi.register(Store.creature.density, { cc: 0, update: v => 10 + v * 190 })
Midi.register(Store.creature.planeLerp, { cc: 1 })
Midi.register(Store.creature.buildLerp, { cc: 2 })

Tweakpane.register(Store.sound.isPlaying, 'son')
Tweakpane.register(Store.demo, 'démo')
Tweakpane.register(Store.postprocessing.enabled, 'post-process')
Tweakpane.register(Store.creature.scaleX, 'échelle x', { min: 0, max: 1 })
Tweakpane.register(Store.creature.scaleY, 'échelle y', { min: 0, max: 1 })
Tweakpane.register(Store.creature.density, 'densité', { min: 10, max: 200, step: 1 })
Tweakpane.register(Store.creature.planeLerp, 'sédimentation', { min: 0, max: 1 })
Tweakpane.register(Store.creature.buildLerp, 'construction', { min: 0, max: 1 })

PostProcessing.register(Scene.canvas)

Raf.add(() => {
  if (!window.ENV.production) {
    document.title = `${window.ENV.pageTitle} | [${Store.raf.fps.current.toFixed(0)} fps]`
  }

  if (Store.demo.get()) {
    const t = Math.sin(Date.now() / 1000) + 1
    Store.creature.planeLerp.set(Math.min(t, 1))
    Store.creature.buildLerp.set(Math.max(1, t) - 1)
  }

  Animation.update()
  Scene.render()

  if (!Store.postprocessing.enabled.get()) return

  /* eslint-disable dot-notation */
  PostProcessing.SHADERS.sobel.uniforms['resolution'].value.x = Math.sin(Date.now() / 1000) * 200
  PostProcessing.SHADERS.sobel.uniforms['resolution'].value.y = Math.sin(Date.now() / 1000) * 200
  PostProcessing.render()
})
