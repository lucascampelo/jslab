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

    <div class="row q-mt-md">
      <div class="col text-center">
        <div class="inline-block bg-negative text-white q-py-sm q-px-lg rounded-borders" v-if="errorMessage" v-text="errorMessage" />
      </div>
    </div>

    <div class="row flex-center q-mt-lg">
      <video id="video" width="720" height="560" autoplay muted @dblclick="flipCamera" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'WebCam',
  data: () => ({
    streamStarted: false,
    rearCamera: false,
    errorMessage: null
  }),
  methods: {
    flipCamera () {
      if (!this.streamStarted) {
        return
      }

      this.rearCamera = !this.rearCamera
      this.startVideo()
    },
    startVideo () {
      this.errorMessage = null
      const video = this.$el.querySelector('#video')
      const videoConstraints = {
        video: this.rearCamera ? { facingMode: { exact: 'environment' } } : {}
      }

      const videoStreamPromise = navigator.mediaDevices.getUserMedia(videoConstraints)
      videoStreamPromise
        .then((stream) => {
          video.srcObject = stream
          this.streamStarted = true
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
      const video = this.$el.querySelector('#video')
      video.srcObject = null
      this.streamStarted = false
    }
  }
}
</script>
