import { Shape } from 'zdog'
import { Ellipse } from 'zdog'
import Limb from 'abstractions/Limb'
import Prng from 'utils/prng'

export default class Eye extends Limb {
  render (props) {
    this.timeScale = Prng.random()

    this.refs.globe = new Shape({
      addTo: this.anchor,
      stroke: props.radius,
      color: '#fff'
    })

    switch (props.appearence) {
      case 1:
        this.refs.pupil = new Ellipse({
          addTo: this.refs.globe,
          diameter: props.radiusPupil,
          stroke: props.radiusPupil/2,
          color: '#000',
          translate: { z: props.radius / 2 },
          rotate: { z: Prng.random() },
        });
        break;
      case 2:
        this.refs.pupil = new Shape({
          addTo: this.refs.globe,
          path: [
            { y: -props.radiusPupil/2 }, 
            { y: props.radiusPupil/2 },
            { move: { x: -props.radiusPupil/2, y: 0 } },
            { x: props.radiusPupil/2 }, 
          ],
          closed: false,
          color: '#000',
          stroke: props.radiusPupil/2,
          translate: { z: props.radius / 2 },
          rotate: { z: Prng.random() }
        });
        
        break;
      default:
        this.refs.pupil = new Shape({
          addTo: this.refs.globe,
          color: '#000',
          stroke: props.radiusPupil,
          translate: { z: props.radius / 2 },
          rotate: { z: Prng.random() }
        })
    }
  }

  update ({ ellapsedTime, frameCount }) {
    this.anchor.rotate.x = Math.sin(this.timeScale * ellapsedTime / 500)
    this.anchor.rotate.y = Math.sin(this.timeScale * ellapsedTime / 600)
  }
}
