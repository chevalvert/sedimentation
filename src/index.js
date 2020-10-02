import Store from 'store/store'
import { debounce } from 'tiny-throttle'

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

Raf.add(() => {
  if (!window.ENV.production) {
    document.title = `${window.ENV.pageTitle} | [${Store.raf.fps.current.toFixed(0)} fps]`
  }

  Animation.update()
  Scene.render()
})
