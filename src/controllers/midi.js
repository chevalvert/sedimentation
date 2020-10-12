import Store from 'store/store'
import WebMidi from 'webmidi'

import { normalize } from 'missing-math'

const derivations = []

function setup () {
  if (Store.midi.ready.get()) return

  const input = WebMidi.inputs.find(input => {
    return input.name.toUpperCase().includes(Store.midi.input.current.toUpperCase())
  })
  if (!input) return

  Store.midi.ready.set(true)

  input.addListener('controlchange', 'all', e => {
    if (Store.midi.debug.get()) console.log(e.controller, e.value)
    const cc = e.controller.number
    if (derivations[cc]) {
      const { signal, update } = derivations[cc]
      signal.set(update(normalize(e.value, 0, 127), signal.current))
    }
  })
}

WebMidi.enable(error => {
  if (error) {
    console.error('WebMidi could not be enabled.', error)
    return
  }

  setup()
  WebMidi.addListener('connected', setup)
})

export default {
  register: (signal, { cc, update = v => v } = {}) => {
    derivations[cc] = { signal, update }
  }
}
