<template>
  <q-page padding>
    <div class="row">
      <div class="col text-center">
        <q-btn color="primary" @click="!streamStarted ? startVideo() : stopVideo()">
          <q-icon name="videocam" />
          <span class="q-ml-md" v-text="!streamStarted ? 'Iniciar WebCam' : 'Parar WebCam'" />
        </q-btn>

        <q-btn class="q-ml-sm" color="secondary" @click="flipCamera" :disabled="!streamStarted">
          <q-icon name="flip_camera_android" />
          <span class="q-ml-md">Flip</span>
        </q-btn>
      </div>
    </div>

    <div class="row flex-center q-my-md">
      <input type="range" id="zoom-range" :disabled="!zoomCapability" @input="updateZoom" />
    </div>

    <div class="row q-mx-xs" v-if="errorMessage">
      <div class="col text-center">
        <div class="inline-block bg-negative text-white q-py-sm q-px-lg rounded-borders" v-text="errorMessage" />
      </div>
    </div>

    <div class="row flex-center q-mt-lg">
      <video id="video" width="720" height="560" autoplay muted @dblclick="flipCamera" />
    </div>
  </q-page>
</template>

<script>
import Hammer from 'hammerjs'
import { debounce } from 'lodash'

export default {
  name: 'WebCam',
  data: () => ({
    streamStarted: false,
    zoomCapability: false,
    rearCamera: false,
    errorMessage: null,
    stream: null,
    hammer: null
  }),
  methods: {
    flipCamera () {
      if (!this.streamStarted) {
        return
      }

      this.rearCamera = !this.rearCamera
      if (this.zoomCapability) {
        const input = this.$el.querySelector('#zoom-range')

        input.value = this.stream.getVideoTracks()[0].getCapabilities().zoom.min
        input.dispatchEvent(new Event('input'))
      }
      this.stopVideo()
      this.startVideo()
    },
    async startVideo () {
      this.errorMessage = null
      const video = this.$el.querySelector('#video')
      let videoConstraints = {
        video: this.rearCamera ? { facingMode: { exact: 'environment' } } : {}
      }

      const videoStreamPromise = navigator.mediaDevices.getUserMedia(videoConstraints)
      return videoStreamPromise
        .then(async (stream) => {
          this.stream = stream

          const videoTrack = this.stream.getVideoTracks()[0]
          video.width = videoTrack.getSettings().width
          video.height = videoTrack.getSettings().height
          video.srcObject = this.stream
          this.streamStarted = true
          await this.zoomCapabilities()
        })
        .catch(err => {
          console.error(err, typeof err)

          switch (err.name) {
            case 'NotFoundError':
            case 'DevicesNotFoundError':
              this.errorMessage = 'WebCam não encontrada.'
              break
            case 'NotReadableError':
            case 'TrackStartError':
              this.errorMessage = 'WebCam já está em uso.'
              break
            case 'OverconstrainedError':
            case 'ConstraintNotSatisfiedError':
              this.errorMessage = 'Configurações não suportadas no dispositivo.'
              break
            case 'NotAllowedError':
            case 'PermissionDeniedError':
              this.errorMessage = 'Permissão negada pelo usuário.'
              break
            default:
              this.errorMessage = ` Um erro inexperado ocorreu (${err.name}: ${err.message}).`
              break
          }
        })
    },
    stopVideo () {
      if (this.hammer) {
        this.hammer.destroy()
        this.hammer = null
      }

      const video = this.$el.querySelector('#video')
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
        this.stream = null
      }

      video.srcObject = null
      this.streamStarted = false
      this.zoomCapability = false
    },
    async zoomCapabilities () {
      const videoTrack = this.stream.getVideoTracks()[0]
      // Once crbug.com/711524 is fixed, we won't need to wait anymore. This is
      // currently needed because capabilities can only be retrieved after the
      // device starts streaming. This happens after and asynchronously w.r.t.
      // getUserMedia() returns.
      await sleep(1000)

      const capabilities = videoTrack.getCapabilities()
      if (!('zoom' in capabilities)) {
        console.info('Zoom não é suportado por ' + videoTrack.label)
        return
      }

      this.handleZoom()

      const input = this.$el.querySelector('#zoom-range')
      input.min = capabilities.zoom.min
      input.max = capabilities.zoom.max
      input.step = capabilities.zoom.step
      input.value = videoTrack.getSettings().zoom
      this.zoomCapability = true
    },
    updateZoom (event) {
      const track = this.stream.getVideoTracks()[0]

      const constraits = Object.assign({}, track.getConstraints(), {
        advanced: [{ zoom: event.target.value }]
      })

      track.applyConstraints(constraits)
    },
    handleZoom () {
      if (this.hammer) {
        return
      }

      this.hammer = new Hammer(document.body)

      let currentZoomValue = null
      this.hammer.get('pinch').set({ enable: true })

      const pinchEventHandler = debounce((pointerEvent) => {
        if (pointerEvent.type === 'pinchend') {
          return
        }

        const { min, max } = this.stream.getVideoTracks()[0].getCapabilities().zoom

        let newZoomValue = currentZoomValue + (currentZoomValue * (pointerEvent.scale - 1))
        if (newZoomValue < min) {
          newZoomValue = min
        }
        if (newZoomValue > max) {
          newZoomValue = max
        }

        const input = this.$el.querySelector('#zoom-range')
        input.value = newZoomValue
        input.dispatchEvent(new Event('input'))
      }, 50, { maxWait: 50 })

      this.hammer.on('pinchstart', () => {
        const videoTrack = this.stream.getVideoTracks()[0]
        const settings = videoTrack.getSettings()
        if (!('zoom' in settings)) {
          return
        }

        // Captura o valor atual do Zoom na Câmera
        currentZoomValue = this.$el.querySelector('#zoom-range').value * 1
      })

      this.hammer.on('pinchin pinchout pinchmove', pinchEventHandler)

      this.hammer.on('pinchend', function () {
        currentZoomValue = null
      })
    }
  },
  beforeDestroy () {
    this.stopVideo()
  }
}
function sleep (ms = 0) {
  // eslint-disable-next-line
  return new Promise(r => setTimeout(r, ms))
}
</script>
