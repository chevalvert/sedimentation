import Store from 'store/store'
import Tweakpane from 'tweakpane'

const pane = new Tweakpane()
const VALUE_CONTAINER = {}

Store.tweakpane.disabled.subscribe(() => pane.dispose())

export default {
  register: (signal, name, options) => {
    VALUE_CONTAINER[name] = signal.get()
    const input = pane.addInput(VALUE_CONTAINER, name, options)

    input.on('change', v => signal.set(v))

    signal.subscribe(v => {
      VALUE_CONTAINER[name] = v
      input.refresh()
    })
  }
}
