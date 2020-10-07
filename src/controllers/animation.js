import Store from 'store/store'

import Creature from 'abstractions/Creature'
import Scene from 'controllers/scene'

import lerpPoint from 'utils/point-lerp'

let creature

Store.seed.subscribe(spawn)
spawn()

function spawn () {
  if (creature) creature.destroy()
  creature = new Creature(Scene.anchor)
}

function update () {
  const ellapsedTime = Store.raf.ellapsedTime.get()
  const frameCount = Store.raf.frameCount.get()

  creature.update({ ellapsedTime, frameCount })

  Store.scene.rotation.update(rotation => {
    // const t = Store.creature.planeLerp.get()
    // return lerpPoint(rotation, { x: 0, y: 0, z: 0 }, t)
    return {
      ...rotation,
      x: Store.creature.buildLerp.get(),
      z: Store.creature.buildLerp.get()
    }
  })
}

export default { update }
