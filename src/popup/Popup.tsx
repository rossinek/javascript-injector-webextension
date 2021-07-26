

import { computed, defineComponent, onMounted, ref } from 'vue'
import styled, { injectGlobal } from 'vue3-styled-components';
import { browser } from 'webextension-polyfill-ts';
import { Cache, ScriptDefinition, readCache, CachedScriptDefinition } from '../shared/cache'
import BaseButton from './components/BaseButton'
import ScriptForm from './components/ScriptForm'
import ScriptList from './components/ScriptList'

const AddScriptButton = styled(BaseButton)`
  margin-top: 20px;
`
const NEW_SCRIPT_ID = 'NEW_SCRIPT'

export default defineComponent({
  components: {
    BaseButton,
    ScriptForm,
    ScriptList,
  },
  setup() {
    const formVisibleFor = ref<string>()
    const isNewScriptFormVisible = computed(() => formVisibleFor.value === NEW_SCRIPT_ID)
    const editedScriptId = computed(() => formVisibleFor.value && formVisibleFor.value !== NEW_SCRIPT_ID ? formVisibleFor.value : undefined)
    const hideForm = () => { formVisibleFor.value = undefined }
    const showForm = (id?: string) => { formVisibleFor.value = id || NEW_SCRIPT_ID }

    const cache = ref<Cache>([])

    const registerScript = (payload: ScriptDefinition) => {
      browser.runtime.sendMessage({ action: 'registerScript', payload });
      hideForm()
    }

    const unregisterScript = (id: string) => {
      browser.runtime.sendMessage({ action: 'unregisterScript', payload: { id } });
    }

    const updateScript = (payload: CachedScriptDefinition) => {
      browser.runtime.sendMessage({ action: 'updateScript', payload });
      hideForm()
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

    return () => <>
      <ScriptList
        cache={cache.value}
        editScriptId={editedScriptId.value}
        onEdit={showForm}
        onRemove={unregisterScript}
        onSave={updateScript}
        onCancelEdit={hideForm}
      />
      {isNewScriptFormVisible.value ? (
        <ScriptForm
          onCancel={hideForm}
          onSubmit={registerScript}
        />
      ) : (
        <AddScriptButton
          type="button"
          onClick={() => showForm()}
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
    font-size: 12px;
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    width: 550px;
    padding: 10px;
    background-color: #232323;
    color: #ccc;
  }
`
