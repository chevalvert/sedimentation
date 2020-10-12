import { readable, writable, derived } from 'utils/state'

const Store = {
  seed: writable(Date.now()),

  demo: undefined, // See below for derivation
  lerp: {
    plane: writable(0),
    build: writable(0)
  },

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
    oscillationFreq: writable(0.001),
    oscillationAmp: writable(10),
    density: writable(20),
    scaleX: writable(1),
    scaleY: writable(1),
    planeLerp: writable(0),
    buildLerp: writable(0)
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

  postprocessing: {
    quality: readable(0.4),
    enabled: writable(true),
    // sobelResolutionX: writable(0)
    edgeWorkRadius: writable(300),
    blurStrength: writable(0)
  },

  midi: {
    debug: writable(false),
    ready: writable(false),
    input: readable('nanoKONTROL2')
  },

  sound: {
    url: readable('sedimentation.mp3'),
    isPlaying: writable(true)
  },

  tweakpane: {}
}

//Store.demo = derived(Store.midi.ready, v => !v)
Store.demo = writable(false)

Store.lerp.mixed = derived([Store.lerp.plane, Store.lerp.build], () => {
  return (1 - Store.lerp.plane.current) * Store.lerp.build.current
})

window.Store = Store
export default Store
