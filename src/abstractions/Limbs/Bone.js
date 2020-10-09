import Store from 'store/store'
import { Shape } from 'zdog'
import Limb from 'abstractions/Limb'

import lerpPoint from 'utils/point-lerp'
import Prng from 'utils/prng'

export default class Bone extends Limb {
  render (props) {
    this.state.initialRotation = {
      x: (Prng.randomInt(0, 10) * Math.PI / 3) % Math.PI,
      y: (Prng.randomInt(0, 10) * Math.PI / 3) % Math.PI,
      z: (Prng.randomInt(0, 10) * Math.PI / 3) % Math.PI
    }

    this.refs.bone = new Shape({
      addTo: this.anchor,
      stroke: props.weight,
      color: props.color,
      path: [
        { x: 0, y: 0 },
        { x: props.length }
      ],
      closed: false,
      rotate: this.state.initialRotation
    })
  }

  update ({ ellapsedTime, frameCount }) {
    const wallFactor = Store.lerp.build.get()
    this.refs.bone.scale = 1 + 1 * wallFactor ** 3
    this.refs.bone.rotate = lerpPoint(this.state.initialRotation, { x: 0, y: Math.PI / 2, z: 0 }, wallFactor)
    this.refs.bone.updatePath()
  }
}
