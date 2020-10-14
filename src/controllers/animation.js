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
    const t = ellapsedTime / 1000
    return {
      x: Store.lerp.build.get() + t * Store.scene.rotationSpeedX.get(),
      y: t * Store.scene.rotationSpeedY.get(),
      z: Store.lerp.build.get() + t * Store.scene.rotationSpeedZ.get()
    }
  })

  Store.scene.bgColor.update(bgColor => {
    Scene.canvas.style.backgroundColor = 'hsl('+ Store.scene.bgColor.get() +',100%,30%)'; 
  })

  Store.scene.bgImage.update(bgImage => {
    Scene.main.style.backgroundImage = "url('texture-"+Store.scene.bgImage.get()+".jpg')"; 
  })

  //Store.scene.bgImage.get()
  
}

export default { update }
