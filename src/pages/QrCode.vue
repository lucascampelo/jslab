<template>
  <q-page padding>
    <div class="row">
      <div class="col text-center">
        <q-btn color="primary" @click="!streamStarted ? startVideo() : stopVideo()">
          <q-icon name="videocam" />
          <span class="q-ml-md" v-text="!streamStarted ? 'Iniciar WebCam' : 'Parar WebCam'" />
        </q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col text-center">
        <div class="inline-block bg-negative text-white q-py-sm q-px-lg rounded-borders" v-if="errorMessage" v-text="errorMessage" />
      </div>
    </div>

    <div class="row flex-center q-mt-lg">
      <div v-if="qrCodeResult" class="qrcode-result text-center">
        <p>Resultado:</p>
        <p v-text="qrCodeResult" />
      </div>
      <div class="video-wrapper" :class="{active: streamStarted}" style="width: 640px; height: 480px;">
        <video id="video" width="100%" height="100%" autoplay muted />
        <div class="qrcode-aim"></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import QrScanner from 'qr-scanner/qr-scanner.min'
// eslint-disable-next-line
import QrScannerWorker from '!!file-loader!qr-scanner/qr-scanner-worker.min.js';
QrScanner.WORKER_PATH = QrScannerWorker

export default {
  name: 'QrCode',
  data: () => ({
    streamStarted: false,
    errorMessage: null,
    video: null,
    stream: null,
    qrScanner: null,
    qrCodeResult: null
  }),
  mounted () {
    this.video = this.$el.querySelector('#video')
  },
  methods: {
    async startVideo () {
      this.errorMessage = null
      this.qrCodeResult = null
      const videoConstraints = {
        video: { facingMode: { exact: 'environment' } }
      }

      const videoStreamPromise = navigator.mediaDevices.getUserMedia(videoConstraints)
      await videoStreamPromise
        .then((stream) => {
          this.video.srcObject = this.stream = stream
          const { width, height } = stream.getVideoTracks()[0].getSettings()
          this.video.parentElement.style.width = `${width}px`
          this.video.parentElement.style.height = `${height}px`
          this.streamStarted = true
          this.qrScanner = new QrScanner(this.video, result => (this.setResult(result)))
          this.qrScanner.start()
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
      if (this.qrScanner) {
        this.qrScanner.destroy()
        this.qrScanner = null
      }

      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
        this.stream = null
      }

      this.video.srcObject = null
      this.streamStarted = false
    },
    setResult (result) {
      this.qrCodeResult = result
      this.stopVideo()
    }
  },
  beforeDestroy () {
    this.stopVideo()
  }
}
</script>

<style lang="scss" scoped>
.video-wrapper {
  position: relative;

  .qrcode-aim {
    width: 240px;
    height: 240px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -120px;
    margin-left: -120px;

    border: 20px dashed rgba(0,0,0,0.2);
    border-radius: 20px;
    display: none;
  }
  &.active {
    .qrcode-aim {
      display: block;
    }
  }
}
</style>
