import { Shape } from 'zdog'
import Limb from 'abstractions/Limb'

import Prng from 'utils/prng'

export default class Bone extends Limb {
  render (props) {
    this.refs.bone = new Shape({
      addTo: this.anchor,
      stroke: props.weight,
      color: props.color,
      path: [
        { x: 0, y: 0 },
        { x: props.length }
      ],
      closed: false,
      rotate: {
        x: Prng.randomInt(0, 10) * Math.PI / 3,
        y: Prng.randomInt(0, 10) * Math.PI / 3,
        z: Prng.randomInt(0, 10) * Math.PI / 3
      }
    })
  }

  update ({ ellapsedTime, frameCount }) {}
}
