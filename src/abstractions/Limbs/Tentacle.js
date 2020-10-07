import Store from 'store/store'
import { Shape } from 'zdog'
import Limb from 'abstractions/Limb'

import lerpPoint from 'utils/point-lerp'
import Prng from 'utils/prng'

export default class Tentacle extends Limb {
  render (props) {
    this.state.speed = Prng.random()

    this.state.initialRotation = {
      x: Prng.randomFloat(0, Math.PI),
      y: Prng.randomFloat(0, Math.PI),
      z: Prng.randomFloat(0, Math.PI)
    }

    this.state.initialBezier = [
      { x: props.length / 2, y: -props.length },
      { x: props.length / 2, y: props.length },
      { x: props.length, y: props.length }
    ]

    this.refs.tentacle = new Shape({
      addTo: this.anchor,
      stroke: props.weight,
      color: props.color,
      path: [
        { x: 0, y: 0 },
        {
          bezier: this.state.initialBezier
        }
      ],
      closed: false,
      rotate: this.state.initialRotation
    })
  }

  update ({ ellapsedTime, frameCount }) {
    const amp = 1 - Store.creature.planeLerp.get()
    const wallFactor = Store.creature.buildLerp.get()

    this.refs.tentacle.path[1].bezier[0].y = this.props.length / 2 * Math.sin(this.state.speed * ellapsedTime / 100) * amp
    this.refs.tentacle.path[1].bezier[0].z = this.props.length / 2 * Math.cos(this.state.speed * ellapsedTime / 100) * amp
    this.refs.tentacle.path[1].bezier[2].x = this.props.length * Math.cos(this.state.speed * ellapsedTime / 100) * amp

    this.refs.tentacle.rotate = lerpPoint(this.state.initialRotation, { x: Math.PI / 2, y: 0, z: 0 }, wallFactor)

    this.refs.tentacle.path[1] = {
      bezier: [
        lerpPoint(this.state.initialBezier[0], { x: 0, y: 0, z: 0 }, wallFactor),
        lerpPoint(this.state.initialBezier[1], { x: 0, y: 20, z: 0 }, wallFactor),
        lerpPoint(this.state.initialBezier[2], { x: 0, y: 20, z: 0 }, wallFactor)
      ]
    }

    this.refs.tentacle.updatePath()
  }
}
