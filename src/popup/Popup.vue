<template>
  <ScriptList
    :cache="cache"
    @remove="unregisterScript"
  />
  <ScriptForm
    v-if="showForm"
    @cancel="showForm = false"
    @submit="registerScript"
  />
  <BaseButton
    v-if="!showForm"
    class="add-button"
    type="button"
    @click="showForm = true"
  >
    + Add a script
  </BaseButton>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { browser } from 'webextension-polyfill-ts';
import { Cache, ScriptDefinition, readCache } from '../shared/cache'
import BaseButton from './components/BaseButton.vue'
import ScriptForm from './components/ScriptForm.vue'
import ScriptList from './components/ScriptList.vue'

export default defineComponent({
  components: {
    BaseButton,
    ScriptForm,
    ScriptList,
  },
  setup() {
    const showForm = ref(false)

    const cache = ref<Cache>([])

    const registerScript = (payload: ScriptDefinition) => {
      browser.runtime.sendMessage({ action: 'registerScript', payload });
      showForm.value = false
    }

    const unregisterScript = (id: string) => {
      browser.runtime.sendMessage({ action: 'unregisterScript', payload: { id } });
    }

    const loadCache = async () => {
      cache.value = await readCache()
    }

    onMounted(() => {
      loadCache()

      browser.runtime.onMessage.addListener((payload) => {
        switch (payload.action) {
          case 'reloadList':
            loadCache()
            break;
          default:
            break;
        }
      });
    })

    return {
      showForm,
      registerScript,
      unregisterScript,
      loadCache,
      cache,
    }
  },
})
</script>

<style>
:root {
  --c-primary: #00b34d;
}
html {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
body {
  width: 550px;
  padding: 20px;
  background-color: #232323;
  color: #ccc;
}
</style>

<style scoped>
.add-button {
  margin-top: 20px;
}
</style>
