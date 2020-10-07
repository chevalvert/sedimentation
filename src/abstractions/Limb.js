import { Anchor, Shape } from 'zdog'

export default class Limb {
  static Shape (anchor, props) {
    const limb = new Limb(anchor, props)
    limb.refs.shape = new Shape({
      addTo: limb.anchor,
      ...props
    })
    return limb
  }

  constructor (anchor, props) {
    this.anchor = new Anchor({ addTo: anchor })
    this.props = props
    this.refs = {}
    this.state = {}
    this.render(props)
  }

  render () {}
  update () {}

  get visible () { return this.anchor.visible }
  set visible (v) {
    Object.values(this.refs).forEach(ref => { ref.visible = v })
  }

  copy (anchor, props = this.props) {
    const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    copy.anchor = new Anchor({ addTo: anchor })
    copy.props = props
    copy.refs = {}
    Object.entries(this.refs).forEach(([key, ref]) => {
      copy.refs[key] = ref.copy({ addTo: copy.anchor, ...props })
    })

    copy.clonedFrom = this
    return copy
  }

  flip () {
    this.flipped = !this.flipped
    return this
  }

  destroy () {
    Object.values(this.refs).forEach(ref => ref.remove())
    this.anchor.remove()
  }
}
