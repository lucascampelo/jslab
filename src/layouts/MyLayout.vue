<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          <router-link to="/" class="text-white" style="text-decoration: none;">Javascript Lab</router-link>
        </q-toolbar-title>

        <q-btn type="a" target="_blank" href="https://github.com/lucascampelo/jslab/" flat dense icon="code" class="q-mr-sm">
          Lucas Campelo
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Experimentos</q-item-label>
        <q-item :to="{ name: 'webcam' }">
          <q-item-section avatar>
            <q-icon name="videocam" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Webcam</q-item-label>
            <q-item-label caption>navigator.mediaDevices.getUserMedia</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>
