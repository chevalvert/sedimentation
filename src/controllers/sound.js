import Store from 'store/store'
import * as Tone from 'tone'

const reverb = new Tone.Reverb(2).toDestination()

const player = new Tone.GrainPlayer({
  url: Store.sound.url.get(),
  loop: true,
  autostart: false
}).toDestination()

player.connect(reverb)
player.volume.value = -5

Store.sound.isPlaying.subscribe(async isPlaying => {
  if (isPlaying) {
    await Tone.start()
    Tone.Transport.start()
    Tone.Transport.bpm.value = 120
    player.start()
  } else {
    Tone.Transport.stop()
    player.stop()
  }
})

document.addEventListener('click', () => Store.sound.isPlaying.set(true), { once: true })

export default {
  // TODO
}
