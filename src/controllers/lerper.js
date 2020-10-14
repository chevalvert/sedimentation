/**
 * WARNING
 * This controller overrides some key methods of the Readable class, and as such
 * should be used with special care.
 */

import { readable } from 'utils/state'
const LERPABLE_SIGNALS = []

export default {
  register: (signal, easing = 0.09) => {
    if (signal instanceof readable) return

    signal.target = signal.current
    signal.easing = easing

    signal.set = function (v) {
      signal.target = v
    }

    signal.lerp = function () {
      const delta = (signal.target - signal.current)
      if (Math.abs(delta) < 0.001) return
      signal.current += delta * signal.easing
    }

    LERPABLE_SIGNALS.push(signal)
  },

  update: function () {
    LERPABLE_SIGNALS.forEach(signal => signal.lerp())
  }
}
