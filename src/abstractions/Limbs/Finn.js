import Store from 'store/store'
import { Shape } from 'zdog'
import Limb from 'abstractions/Limb'
import Prng from 'utils/prng'

export default class Finn extends Limb {
  render (props) {
    this.refs.finn = new Shape({
      addTo: this.anchor,
      color: props.color,
      stroke: 4,
      path: [
        { x: 0, z: -props.size / 2 },
        { x: -props.size, z: 0 },
        { x: 0, z: props.size / 2 }
      ],
      closed: true,
      fill: true,
      rotate: {
        x: Prng.random(),
        y: Prng.random()
      },
      scale: {
        x: Prng.random(),
        z: Prng.random()
      }
    })
  }

  update ({ ellapsedTime, frameCount }) {
    const amp = 1 - Store.lerp.plane.get()
    this.anchor.rotate.z = Math.sin((this.props.dir || 1) * ellapsedTime / 500) * amp
  }
}
