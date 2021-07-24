<template>
  <form class="script-form" @submit.prevent="submit">
    <div class="script-form__inputs">
      <div class="script-form__field">
        <div class="script-form__label">Hosts</div>
        <input v-model="hosts" class="script-form__hosts" type="text" />
      </div>
      <div class="script-form__field">
        <div class="script-form__label">
          <span>Code</span>
          <label class="script-form__shortcuts"><input v-model="usesShortcuts" type="checkbox" /> Use shortcuts</label>
        </div>
        <div v-if="usesShortcuts" class="script-form__shortcuts-hint">
          // allowed modifiers: 'alt', 'cmd', 'ctrl', 'shift'<br>
          // shortcut key is lowercased value of `KeyboardEvent.key`<br>
          // e.g. 'g', '5', '#', 'arrowleft'<br><br>
          ShortcutService.registerShortcut('ctrl+g', () => { /* your js code */})<br>
          ShortcutService.registerShortcut('ctrl+alt+d', {<br>
          &nbsp;&nbsp;handler: () => { ... },<br>
          &nbsp;&nbsp;preventOnInputs: true,<br>
          })<br>
          ShortcutService.unregisterShortcut('ctrl+alt+d')<br>
          ShortcutService.unregisterAllShortcuts()<br>
        </div>
        <textarea v-model="code" class="script-form__code"></textarea>
      </div>
    </div>
    <div class="script-form__buttons">
      <BaseButton
        type="button"
        @click="$emit('cancel')"
      >
        cancel
      </BaseButton>
      <BaseButton type="submit">
        save
      </BaseButton>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { browser } from 'webextension-polyfill-ts';
import { ScriptDefinition } from '../../shared/cache'
import BaseButton from './BaseButton.vue'

export default defineComponent({
  components: { BaseButton },
  setup(props, { emit }) {
    const code = ref<string>('document.body.innerHTML = "<h1>This page has been eaten</h1>"')
    const hosts = ref<string>('')
    const usesShortcuts = ref<boolean>(false)

    onMounted(async () => {
      const currentUrl = await browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => tabs[0].url)
        .catch(() => null)
      hosts.value = currentUrl || '*://*.com/*'
    })

    const submit = () => {
      const payload: ScriptDefinition = {
        hosts: hosts.value.split(','),
        code: code.value,
        usesShortcuts: usesShortcuts.value,
      }
      emit('submit', payload)
    }

    return {
      code,
      hosts,
      usesShortcuts,
      submit,
    }
  },
})
</script>

<style scoped>
.script-form {
  display: flex;
  flex-direction: column;
}
.script-form__inputs {
  width: 100%;
}
.script-form__field {
  width: 100%;
  margin-bottom: 10px;
}
.script-form__label {
  margin-bottom: 10px;
}
.script-form__hosts {
  width: 100%;
  background-color: #333;
  color: #ccc;
}
.script-form__shortcuts {
  margin-left: 20px;
  cursor: pointer;
}
.script-form__shortcuts-hint {
  font-size: 11px;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-style: initial;
  opacity: 0.6;
  line-height: 1.2;
  margin-bottom: 10px;
}
.script-form__code {
  width: 100%;
  height: 250px;
}
.script-form input,
.script-form textarea {
  background-color: #333;
  color: #ccc;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 14px;
}
.script-form__buttons {
  margin-top: 10px;
  margin-left: auto;
}
.script-form__buttons button {
  margin-left: 10px;
}
</style>
