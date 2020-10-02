import Store from 'store/store'
import raf from '@internet/raf'

// SEE https://answers.unity.com/questions/64331/accurate-frames-per-second-count.html
const fps = {
  updateRate: 4,
  frameCount: 0,
  ellapsedTime: 0,
  compute: function (dt) {
    this.frameCount++
    this.ellapsedTime += dt / 1000
    if (this.ellapsedTime > 1 / this.updateRate) {
      this._value = this.frameCount / this.ellapsedTime
      this.frameCount = 0
      this.ellapsedTime -= 1 / this.updateRate
    }
    return this._value || 0
  }
}

raf.addBefore(dt => {
  Store.raf.ellapsedTime.update(t => t + dt)
  Store.raf.frameCount.update(v => v + 1)
  Store.raf.fps.set(fps.compute(dt))
})

Store.raf.isRunning.subscribe(isRunning => isRunning ? raf.start() : raf.stop())

export default raf
