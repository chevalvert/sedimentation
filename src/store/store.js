import { writable } from 'utils/state'

const Store = {
  raf: {
    isRunning: writable(false),
    ellapsedTime: writable(0),
    frameCount: writable(0),
    fps: writable(0)
  },

  scene: {
    zoom: writable(4),
    rotation: writable({ x: 0, y: 0, z: 0 }),
    dimensions: writable([0, 0])
  }
}

window.Store = Store
export default Store
