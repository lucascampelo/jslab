<template>
  <q-page padding>
    <div class="row">
      <h5 class="q-my-none">WebAuthn</h5>
    </div>
    <div class="row q-pb-lg">
      <span class="text-grey">Criado pela W3C, WebAuthn é uma promissora API para autenticação sem senha</span>
    </div>

    <div class="row q-pb-lg">
      <div class="q-pb-lg text-body1" v-if="!canUseWebAuthn">
        <Note type="negative" label="Seu navegador não tem suporte para utilizar WebAuthn."/>
      </div>

      <div class="col">
        <q-btn color="positive" label="Criar chave"
               :disable="!canUseWebAuthn"
               @click="createCredential"
        />

        <q-btn color="primary" label="Login"
               :disable="!canUseWebAuthn || !credentials.length"
               @click="login"
               class="q-mx-md"
        />

        <q-btn label="Limpar"
               :disable="!canUseWebAuthn || !credentials.length"
               @click="clearCredentials"
        />
      </div>
    </div>

    <div class="row" v-if="credentials.length">
      <div class="col">
        <div class="row" v-bind:key="index" v-for="(credential, index) in credentials">
          <div class="col col-sm-6 col-md-4 col-lg-3 q-mb-md">
            <q-card>
              <q-card-section>
                <div class="row">
                  <div class="col col-1">
                    <q-icon name="vpn_key" />
                  </div>
                  <div class="col">
                    <div title="Fingerprint" v-text="credential.fingerprint"></div>
                    <div class="text-grey" title="Data de criação" v-text="credential.created"></div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="row hide">
      <pre v-text="credentials"></pre>
    </div>

  </q-page>
</template>

<script>
import Note from 'components/Note'

export default {
  name: 'WebAuthn',
  components: {
    Note
  },
  data () {
    return {
      credentials: JSON.parse(localStorage.getItem('credentials') || '[]')
    }
  },
  computed: {
    canUseWebAuthn () {
      return !!navigator.credentials && !!navigator.credentials.preventSilentAccess
    }
  },
  methods: {
    async createCredential () {
      const credentialChallenge = await generateServerMakeCredRequest('lucascampelo', 'Lucas Campelo', 'd2a452edff079ca6980edcf54cc49945')
      let credentialInfo = await navigator.credentials.create({ publicKey: credentialChallenge })
      await this.storeCredential(credentialInfo)
    },
    async login () {
      // Estes dados devem vir do servidor, estou gerando de forma estática somente para estudos

      try {
        const credentialChallenge = await generateServerAvaliableCredRequest(this.credentials)
        let credentialInfo = await navigator.credentials.get({ publicKey: credentialChallenge })
        console.log(credentialInfo)
      } catch (error) {
        console.log('FAIL', error)
      }
    },
    storeCredential (credentialInfo) {
      this.credentials.push(publicKeyCredentialToString(credentialInfo))
      localStorage.setItem('credentials', JSON.stringify(this.credentials))
    },
    deleteCredential (credentialInfo) {
      console.log('deleteCredential', credentialInfo, this.credentials)
    },
    clearCredentials () {
      this.credentials = []
      localStorage.setItem('credentials', JSON.stringify(this.credentials))
    }
  }
}

/**
 * Este método serve apenas para estudo. Os dados criados aqui devem vir do servidor.
 *
 * @param {string} username
 * @param {string} displayName
 * @param {string} userId
 *
 * @returns {Promise}
 */
async function generateServerMakeCredRequest (username, displayName, userId) {
  const randomString = '7JGeroQlsy4X8FOXDp/GXM9eidJGaD8n8VfCfuquIjg=',
    challenge = strToBin(randomString),
    id = strToBin(userId)

  return new Promise(
    resolve => setTimeout(() => resolve({
      challenge,
      rp: {
        id: location.hostname,
        name: 'lucascampelo-jslab'
      },
      user: {
        id,
        name: username,
        displayName
      },
      attestation: 'direct',
      pubKeyCredParams: [
        { type: 'public-key', 'alg': -7 },
        { type: 'public-key', 'alg': -35 },
        { type: 'public-key', 'alg': -36 },
        { type: 'public-key', 'alg': -257 },
        { type: 'public-key', 'alg': -258 },
        { type: 'public-key', 'alg': -259 },
        { type: 'public-key', 'alg': -37 },
        { type: 'public-key', 'alg': -38 },
        { type: 'public-key', 'alg': -39 }
      ],
      authenticatorSelection: { requireResidentKey: false, userVerification: 'discouraged' }
      // Faltando somente a chave extensions
    }), 150)
  )
}

async function generateServerAvaliableCredRequest (credentials) {
  const randomString = '/iJhHoHRwsqc70itD71iBiqlXDmGNMV2weAeMkBanz0=',
    challenge = strToBin(randomString),
    allowCredentials = credentials.map(({ rawId, type }) => ({
      id: strToBin(rawId),
      type
    }))

  return new Promise(
    resolve => setTimeout(() => resolve({
      rpId: location.hostname,
      challenge,
      allowCredentials,
      userVerification: 'discouraged'
    }), 150)
  )
}

function strToBin (str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0))
}

function binToStr (bin) {
  return btoa(new Uint8Array(bin).reduce(
    (s, byte) => s + String.fromCharCode(byte), ''
  ))
}

// debug
window.strToBin = strToBin
window.binToStr = binToStr

function publicKeyCredentialToString ({ rawId, response, id, type }) {
  const date = new Date()

  return {
    id,
    type,
    rawId: binToStr(rawId),
    response: {
      attestationObject: binToStr(response.attestationObject),
      clientDataJSON: binToStr(response.clientDataJSON)
    },
    fingerprint: 'A1:B2:C3:D4:E5:F6:G7:H8:I9:J0',
    created: date.toLocaleString()
  }
}
</script>
