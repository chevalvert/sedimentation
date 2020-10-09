import Store from 'store/store'
import { Anchor, Dragger } from 'zdog'

const anchor = new Anchor()
const canvas = document.querySelector('canvas#Scene')
const ctx = canvas.getContext('2d')

const add = (ZdogClass, props) => new ZdogClass({ addTo: anchor, ...props })

// Update Scene canvas when Store dimensions change
Store.scene.dimensions.subscribe(([width, height]) => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.width = canvas.width + 'px'
  canvas.style.height = canvas.height + 'px'
})

// Enable drag-to-rotate
let dragStartRX
let dragStartRY
add(Dragger, {
  startElement: canvas,
  onDragStart: function () {
    dragStartRX = anchor.rotate.x
    dragStartRY = anchor.rotate.y
  },

  onDragMove: function (pointer, moveX, moveY) {
    const minSize = Math.min(canvas.width, canvas.height)
    Store.scene.rotation.update(rotation => ({
      ...rotation,
      x: dragStartRX - (moveY / minSize * Math.PI * 2),
      y: dragStartRY - (moveX / minSize * Math.PI * 2)
    }), true)
  }
})

export default {
  get anchor () { return anchor },
  get canvas () { return canvas },
  get ctx () { return ctx },

  add,
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
