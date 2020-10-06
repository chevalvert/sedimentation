import Store from 'store/store'
import { Shape } from 'zdog'
import Limb from 'abstractions/Limb'

import Prng from 'utils/prng'

export default class Tentacle extends Limb {
  render (props) {
    this.state.speed = Prng.random()

    this.refs.tentacle = new Shape({
      addTo: this.anchor,
      stroke: props.weight,
      color: props.color,
      path: [
        { x: 0, y: 0 },
        {
          bezier: [
            { x: props.length / 2, y: -props.length },
            { x: props.length / 2, y: props.length },
            { x: props.length, y: props.length }
          ]
        }
      ],
      closed: false,
      rotate: {
        x: Prng.randomFloat(0, Math.PI),
        y: Prng.randomFloat(0, Math.PI),
        z: Prng.randomFloat(0, Math.PI)
      }
    })
  }

  update ({ ellapsedTime, frameCount }) {
    const amp = 1 - Store.creature.planeLerp.get()

    this.refs.tentacle.path[1].bezier[0].y = this.props.length / 2 * Math.sin(this.state.speed * ellapsedTime / 100) * amp
    this.refs.tentacle.path[1].bezier[0].z = this.props.length / 2 * Math.cos(this.state.speed * ellapsedTime / 100) * amp

    this.refs.tentacle.path[1].bezier[2].x = this.props.length * Math.cos(this.state.speed * ellapsedTime / 100) * amp
    this.refs.tentacle.updatePath()
  }
}
