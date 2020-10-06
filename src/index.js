import Store from 'store/store'
import { debounce } from 'tiny-throttle'

import Midi from 'controllers/midi'
import Animation from 'controllers/animation'
import Raf from 'controllers/raf'
import Scene from 'controllers/scene'

window.onresize = debounce(() => {
  Store.scene.dimensions.set([window.innerWidth, window.innerHeight])
}, 10)

window.onload = () => {
  window.onresize()
  document.body.classList.remove('is-loading')
  Store.raf.isRunning.set(true)
}

Midi.derive(Store.seed, { cc: 41, update: v => Date.now() })
Midi.derive(Store.seed, { cc: 18, update: v => Date.now() })
Midi.derive(Store.creature.scaleX, { cc: 16 })
Midi.derive(Store.creature.scaleY, { cc: 17 })
Midi.derive(Store.creature.density, { cc: 0, update: v => 10 + v * 190 })
Midi.derive(Store.creature.planeLerp, { cc: 1 })

Raf.add(() => {
  if (!window.ENV.production) {
    document.title = `${window.ENV.pageTitle} | [${Store.raf.fps.current.toFixed(0)} fps]`
  }

  Animation.update()
  Scene.render()
})
