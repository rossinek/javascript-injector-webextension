

import { defineComponent, onMounted, ref } from 'vue'
import styled, { injectGlobal } from 'vue3-styled-components';
import { browser } from 'webextension-polyfill-ts';
import { Cache, ScriptDefinition, readCache } from '../shared/cache'
import BaseButton from './components/BaseButton'
import ScriptForm from './components/ScriptForm'
import ScriptList from './components/ScriptList'

const AddScriptButton = styled(BaseButton)`
  margin-top: 20px;
`
export default defineComponent({
  components: {
    BaseButton,
    ScriptForm,
    ScriptList,
  },
  setup() {
    const isFormVisible = ref(false)

    const cache = ref<Cache>([])

    const registerScript = (payload: ScriptDefinition) => {
      browser.runtime.sendMessage({ action: 'registerScript', payload });
      isFormVisible.value = false
    }

    const unregisterScript = (id: string) => {
      browser.runtime.sendMessage({ action: 'unregisterScript', payload: { id } });
    }

    const loadCache = async () => {
      cache.value = await readCache()
    }

    const hideForm = () => { isFormVisible.value = false }
    const showForm = () => { isFormVisible.value = true }

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

    return () => <>
      <ScriptList
        cache={cache.value}
        onRemove={unregisterScript}
      />
      {isFormVisible.value ? (
        <ScriptForm
          onCancel={hideForm}
          onSubmit={registerScript}
        />
      ) : (
        <AddScriptButton
          type="button"
          onClick={showForm}
        >
          + Add a script
        </AddScriptButton>
      )}
      <div id="modal-target" />
    </>
  },
})

injectGlobal`
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
`
