import Store from 'store/store'
import { Ellipse, Shape } from 'zdog'
import Scene from 'controllers/scene'

// Add anonymously
Scene.add(Ellipse, {
  diameter: 80,
  stroke: 5,
  translate: { z: -30 },
  color: 'white'
})

// Add and store the Zdog shape for future reference
const ellipse = Scene.add(Ellipse, {
  diameter: 80,
  translate: { z: -20 },
  color: 'black'
})

const triangle = Scene.add(Shape, {
  path: [
    { x: 0, y: -32 },
    { x: 32, y: 32 },
    { x: -32, y: 32 }
  ],
  translate: { z: 20 },
  color: 'red',
  stroke: 12,
  fill: true
})

function update () {
  // Get raf values via the Store
  const ellapsedTime = Store.raf.ellapsedTime.get()
  const t = (Math.sin(ellapsedTime / 1000) + 1) / 2

  // Transform Scene shapes
  ellipse.stroke = 10 + (t * 10)
  triangle.scale.x = 1 + (t * 2)

  // Transform Scene attributes via the Store
  Store.scene.zoom.set(1 + (t * 3))
  Store.scene.rotation.update(rotation => ({ ...rotation, x: t * Math.PI }))
}

export default { update }
