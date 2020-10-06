import { readable, writable } from 'utils/state'

const Store = {
  seed: writable(Date.now()),

  creature: {
    debug: writable(false),
    anchorsLength: readable(4 * 4 * 4), // because 4^3 = 8^2
    colorsLength: readable(2),
    colors: readable([
      '#369378',
      '#e8322d',
      '#6bedad',
      '#218bfc',
      '#7264c7',
      '#fff713',
      '#805c00',
      '#94b4e3',
      '#80fc73',
      '#ff7a0f',
      '#a8a2f5',
      '#7de624',
      '#9dd073',
      '#d2203e',
      '#ff3bd3',
      '#3937a6',
      '#df9d13',
      '#e65cb9',
      '#f9a923',
      '#57f893',
      '#f9d921',
      '#cbd3ac'
    ]),
    density: writable(20),
    scaleX: writable(1),
    scaleY: writable(1),
    planeLerp: writable(0)
  },

  raf: {
    isRunning: writable(false),
    ellapsedTime: writable(0),
    frameCount: writable(0),
    fps: writable(0)
  },

  scene: {
    debug: writable(true),
    zoom: writable(4),
    rotation: writable({ x: 0, y: 0, z: 0 }),
    dimensions: writable([0, 0])
  },

  midi: {
    debug: writable(false),
    ready: writable(false),
    input: readable('nanoKONTROL2 SLIDER/KNOB')
  }
}

window.Store = Store
export default Store