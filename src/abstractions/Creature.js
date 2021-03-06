import Store from 'store/store'
import { Anchor, Shape } from 'zdog'
import hexToRgb from 'hex-rgb'
import { map } from 'missing-math'

import Bone from 'abstractions/Limbs/Bone'
import Eye from 'abstractions/Limbs/Eye'
import Finn from 'abstractions/Limbs/Finn'
import Tentacle from 'abstractions/Limbs/Tentacle'

import arrayPoints from 'utils/create-array-points'
import shuffle from 'utils/array-shuffle'
import Prng from 'utils/prng'
import lerpPoint from 'utils/point-lerp'

export default class Creature {
  constructor (sceneAnchor) {
    this.seed = Prng.seed = Store.seed.get()
    this.anchor = new Anchor({ addTo: sceneAnchor })
    this.anchors = this.createAnchors()
    this.colors = shuffle([...Store.creature.colors.current], Prng.random)
      .splice(0, Store.creature.colorsLength.get())
    this.limbs = this.render()
  }

  // Create all anchors, with a custom .positions prop so that we can lerp
  // each anchor position from two different grid configurations (cube and plane)
  createAnchors (length = Store.creature.anchorsLength.get()) {
    const CUBE = arrayPoints.cube(length)
    const PLANE = shuffle(arrayPoints.plane(length), Prng.random)

    const anchors = []
    for (let index = 0; index < length; index++) {
      const anchor = new Anchor({ addTo: this.anchor })
      anchor.positions = { CUBE: CUBE[index], PLANE: PLANE[index] }
      anchor.dot = new Shape({
        addTo: anchor,
        color: 'white',
        translate: { z: -0.1 },
        path: [{ x: 0.5, y: 0.5 }, { x: -0.5, y: 0.5 }, { x: -0.5, y: -0.5 }, { x: 0.5, y: -0.5 }],
        scale: 0
      })

      anchors.push(anchor)
    }

    anchors.forEach(anchor => {
      anchor.cubeMirror = anchors.find(candidate => {
        const { x, y, z } = candidate.positions.CUBE
        return anchor.positions.CUBE.y === y &&
          anchor.positions.CUBE.z === z &&
          anchor.positions.CUBE.x === -x
      })
    })

    return anchors
  }

  render () {
    const limbs = []

    // Finns
    for (let index = 0; index < Prng.randomInt(0, 10); index++) {
      const anchor = Prng.randomOf(this.anchors.filter(a => a.positions.CUBE.x < 1))
      const props = {
        color: Prng.randomOf(this.colors),
        size: Prng.randomInt(10, 30)
      }
      const finn = new Finn(anchor, props)
      limbs.push(finn)
      limbs.push(finn.copy(anchor.cubeMirror, { dir: -1 }).flip())
    }

    // Eyes
    for (let index = 0; index < (Prng.random() ** 2) * 3; index++) {
      const anchor = Prng.randomOf(this.anchors.filter(a => a.positions.CUBE.z > 1))
      const size = Prng.randomInt(3, 30)
      const props = {
        appearence: Prng.randomInt(0,3),
        radius: size,
        radiusPupil: size / Prng.randomInt(2, 8)
      }
      limbs.push(new Eye(anchor, props))
      limbs.push(new Eye(anchor.cubeMirror, props))
    }

    // Tentacles
    for (let index = 0; index < Prng.randomInt(3, 20); index++) {
      const anchor = Prng.randomOf(this.anchors)
      const props = {
        color: Prng.randomOf(this.colors),
        length: Prng.randomInt(10, 30),
        weight: Prng.randomInt(1, 5)
      }
      const tentacle = new Tentacle(anchor, props)
      limbs.push(tentacle)
      limbs.push(tentacle.copy(anchor.cubeMirror).flip())
    }

    // Bones
    for (let index = 0; index < Prng.randomInt(3, 10); index++) {
      const anchor = Prng.randomOf(this.anchors)
      const props = {
        color: Prng.randomOf(this.colors),
        length: Prng.randomInt(10, 50),
        weight: Prng.randomInt(1, 30)
      }
      const bone = new Bone(anchor, props)
      limbs.push(bone)
      limbs.push(bone.copy(anchor.cubeMirror).flip())
    }

    return limbs
  }

  update ({ ellapsedTime, frameCount }) {
    const [width, height] = Store.scene.dimensions.get()
    const density = Store.creature.density.get()
    this.anchor.scale = {
      x: density * Store.creature.scaleX.get(),
      y: density * Store.creature.scaleY.get(),
      z: density
    }

    this.anchor.translate.y = (1.2 - Store.lerp.plane.current) * Math.sin(ellapsedTime * Store.creature.oscillationFreq.get()) * Store.creature.oscillationAmp.get()

    this.anchors.forEach(anchor => {
      anchor.translate = lerpPoint(anchor.positions.CUBE, anchor.positions.PLANE, Store.lerp.plane.current)

      const opacity = Store.lerp.plane.current ** 4
      anchor.dot.color = `rgba(255, 255, 255, ${opacity})`
      anchor.dot.fill = false
      const hasLimb = anchor.children[1]
      if (hasLimb) {
        const { red, green, blue } = hexToRgb(anchor.children[1].children[0].color)
        anchor.dot.color = `rgba(${red}, ${green}, ${blue})`
        anchor.dot.fill = true
        anchor.dot.stroke = map(Store.lerp.build.current, 0, 1, 1, 0.25)
      }
      //anchor.dot.scale = Store.lerp.build.get()
    })

    this.limbs.forEach(limb => {
      limb.anchor.scale = !limb.flipped
        ? 1 / density
        : {
          x: -1 / density,
          y: 1 / density,
          z: 1 / density
        }

      limb.update({ ellapsedTime, frameCount })
    })
  }

  destroy () {
    this.limbs.forEach(limb => limb.destroy())
    // this.body.remove()
    this.anchors.forEach(anchor => anchor.remove())
    this.anchor.remove()
    delete this.anchor
    delete this.anchors
    // delete this.body
    delete this.limbs
  }
}
