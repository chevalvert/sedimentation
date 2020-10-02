import Store from 'store/store'
import { Anchor } from 'zdog'

const anchor = new Anchor()
const canvas = document.querySelector('canvas#Scene')
const ctx = canvas.getContext('2d')

Store.scene.dimensions.subscribe(([width, height]) => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.width = canvas.width + 'px'
  canvas.style.height = canvas.height + 'px'
})

export default {
  get anchor () { return anchor },
  get canvas () { return canvas },
  get ctx () { return ctx },

  add: (ZdogClass, props) => new ZdogClass({ addTo: anchor, ...props }),
  render: function () {
    const zoom = Store.scene.zoom.get()
    const rotation = Store.scene.rotation.get()
    const [width, height] = Store.scene.dimensions.get()

    anchor.rotate = rotation

    ctx.clearRect(0, 0, width, height)
    anchor.updateGraph()

    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.scale(zoom, zoom)
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    anchor.renderGraphCanvas(ctx)
    ctx.restore()
  }
}
