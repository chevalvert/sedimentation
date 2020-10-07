import { Shape } from 'zdog'
import Limb from 'abstractions/Limb'
import Prng from 'utils/prng'

export default class Eye extends Limb {
  render (props) {
    this.timeScale = Prng.random()

    this.refs.globe = new Shape({
      addTo: this.anchor,
      stroke: props.radius,
      color: 'black'
    })

    this.refs.pupil = new Shape({
      addTo: this.refs.globe,
      color: 'white',
      stroke: props.radius * 0.3,
      translate: { z: props.radius / 2 },
      rotate: { z: Prng.random() }
    })
  }

  update ({ ellapsedTime, frameCount }) {
    this.anchor.rotate.x = Math.sin(this.timeScale * ellapsedTime / 500)
    this.anchor.rotate.y = Math.sin(this.timeScale * ellapsedTime / 500)
  }
}
