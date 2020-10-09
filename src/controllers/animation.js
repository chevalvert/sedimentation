import Store from 'store/store'

import Creature from 'abstractions/Creature'
import Scene from 'controllers/scene'

let creature

Store.seed.subscribe(spawn)
spawn()

function spawn () {
  if (creature) creature.destroy()
  creature = new Creature(Scene.anchor)
  console.log(creature)
}

function update () {
  const ellapsedTime = Store.raf.ellapsedTime.get()
  const frameCount = Store.raf.frameCount.get()

  creature.update({ ellapsedTime, frameCount })

  Store.scene.rotation.update(rotation => {
    return {
      ...rotation,
      x: Store.lerp.build.get(),
      z: Store.lerp.build.get()
    }
  })
}

export default { update }
