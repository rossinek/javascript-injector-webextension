

import { DefineComponent, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import styled, { css } from 'vue3-styled-components';
import { browser } from 'webextension-polyfill-ts';
import { ScriptDefinition } from '../../shared/cache'
import BaseButton from './BaseButton'
import ScriptShortcutsModal from './ScriptShortcutsModal'


const ScriptForm = styled.form`
  display: flex;
  flex-direction: column;
`
const ScriptFormInputs = styled.div`
  width: 100%;
`
const ScriptFormField = styled.div`
  width: 100%;
  margin-bottom: 10px;
`
const ScriptFormLabel = styled.div`
  margin-bottom: 10px;
`
const UseShortcutsLabel = styled.label`
  margin-left: 20px;
  cursor: pointer;
`
const ShortcutButton = styled(BaseButton)`
  margin-right: 10px;
  font-size: 10px;
`
const inputStyles = css`
  background-color: #333;
  color: #ccc;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 12px;
`
const HostsInput = styled.input`
  width: 100%;
  background-color: #333;
  color: #ccc;
  ${() => inputStyles}
`
const CodeTextarea = styled.textarea`
  width: 100%;
  height: 250px;
  ${() => inputStyles}
`
const ScriptFormButtons = styled.div`
  margin-top: 10px;
  margin-left: auto;
  & button {
    margin-left: 10px;
  }
`
const UseShortcutsHintButton = styled(BaseButton)`
  text-align: center;
  margin-left: 10px;
  border-radius: 50% !important;
  width: 30px !important;
  height: 30px !important;
  line-height: 30px !important;
  padding: 0 !important;
`

export default defineComponent({
  props: {
    onSubmit: Function as PropType<(payload: ScriptDefinition) => void>,
    onCancel: Function as PropType<() => void>
  },
  setup(props) {
    const code = ref<string>('document.body.innerHTML = "<h1>This page has been eaten</h1>"')
    const hosts = ref<string>('')
    const usesShortcuts = ref<boolean>(false)
    const showShortcutsModal = ref<boolean>(false)
    const codeTextareaRef = ref<{ $el?: HTMLTextAreaElement }>()
    const hostsTextareaRef = ref<{ $el?: HTMLInputElement }>()

    onMounted(async () => {
      const currentUrl = await browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => tabs[0].url)
        .catch(() => null)
      hosts.value = currentUrl || '*://*.com/*'
      hostsTextareaRef.value?.$el?.focus()
      setTimeout(() => hostsTextareaRef.value?.$el?.setSelectionRange(0, hosts.value.length))
      codeTextareaRef.value?.$el?.setSelectionRange(0, code.value.length)
    })

    const submit = (event: Event) => {
      event.preventDefault()
      if (
        !code.value.includes('ShortcutService') ||
        window.confirm('You are probably using `ShortcutService` in your code but "use shortcut" is off.\n' +
          'If you mean to use service provided by extension you should enable it first.\n\n' +
          'Do you want to save the script anyway?')
      ) {
        props.onSubmit?.({
          hosts: hosts.value.split(','),
          code: code.value,
          usesShortcuts: usesShortcuts.value,
        })
      }
    }

    const addShortcutCode = (script: string, selection: string = '', scriptSuffix: string = '') => {
      const textarea = codeTextareaRef.value?.$el
      if (textarea) {
        const first = code.value.slice(0, textarea.selectionStart || 0)
        const second = code.value.slice(textarea.selectionStart || 0)
        const optionalPrefixNewLine = (!first.length || /\n\s*$/.test(first)) ? '' : '\n'
        const optionalSuffixNewLine = (second.length && /^\s*\n/.test(second)) ? '' : '\n'
        code.value = `${first}${optionalPrefixNewLine}${script}${selection}${scriptSuffix}${optionalSuffixNewLine}${second}`
        const selectionStart = `${first}${optionalPrefixNewLine}${script}`.length
        const selectionEnd = selectionStart + selection.length
        textarea.focus()
        setTimeout(() => {
          textarea.setSelectionRange(selectionStart, selectionEnd)
        })
      }
    }

    const addRegisterShortcutCode = () => {
      addShortcutCode('ShortcutService.registerShortcut("', 'ctrl+arrowup', '", () => { /* ... */})')
    }

    const addUnregisterShortcutCode = () => {
      addShortcutCode('ShortcutService.unregisterShortcut("', 'ctrl+arrowup', '")')
    }

    return () => (
      <ScriptForm onSubmit={submit}>
        <ScriptFormInputs>
          <ScriptFormField>
            <ScriptFormLabel>Hosts</ScriptFormLabel>
            <HostsInput v-model={hosts.value} ref={hostsTextareaRef} type="text" />
          </ScriptFormField>
          <ScriptFormField>
            <ScriptFormLabel>
              <span>Code</span>
              <UseShortcutsLabel><input v-model={usesShortcuts.value} type="checkbox" /> Use shortcuts</UseShortcutsLabel>
              <UseShortcutsHintButton type="button" text onClick={() => { showShortcutsModal.value = true }}>?</UseShortcutsHintButton>
              {usesShortcuts.value && (
                <div>
                  <ShortcutButton type="button" onClick={addRegisterShortcutCode}>+ register shortcut</ShortcutButton>
                  <ShortcutButton type="button" onClick={addUnregisterShortcutCode}>- unregister shortcut</ShortcutButton>
                </div>
              )}
            </ScriptFormLabel>
            {showShortcutsModal.value && (
              <ScriptShortcutsModal onClose={() => { showShortcutsModal.value = false }} />
            )}
            <CodeTextarea v-model={code.value} ref={codeTextareaRef} />
          </ScriptFormField>
        </ScriptFormInputs>
        <ScriptFormButtons>
          <BaseButton
            type="button"
            onClick={() => props.onCancel?.()}
          >
            cancel
          </BaseButton>
          <BaseButton type="submit">
            save
          </BaseButton>
        </ScriptFormButtons>
      </ScriptForm>
    )
  },
})
