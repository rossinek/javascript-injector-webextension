import { FunctionalComponent } from "vue"
import styled from "vue3-styled-components"
import BaseModal from "./BaseModal"

type Props = {
  onClose?: () => void
}

const ShortcutsHint = styled.pre`
  border-radius: 8px;
  border: 1px solid #999;
  background-color: #333;
  padding: 20px;
  font-size: 11px;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-style: initial;
  opacity: 0.6;
  line-height: 1.2;
  margin-bottom: 10px;
`

const hintText = `// When "use shortcuts" is enabled
// You can use \`ShortcutService\` in your code

ShortcutService.registerShortcut('arrowup', () => { /* your js code */})
ShortcutService.registerShortcut('ctrl+alt+d', {
  handler: () => { ... },
  preventOnInputs: true,
})
ShortcutService.unregisterShortcut('ctrl+alt+d')
ShortcutService.unregisterAllShortcuts()

// allowed modifiers: 'alt', 'cmd', 'ctrl', 'shift'
// shortcut key is lowercased value of \`KeyboardEvent.key\`
// e.g. 'g', '5', '#', 'arrowleft'
`

const ScriptShortcutsModal: FunctionalComponent<Props> = (props, { slots }) => (
  <BaseModal onClose={() => props.onClose?.()}>
    <ShortcutsHint>{hintText}</ShortcutsHint>
  </BaseModal>
)

ScriptShortcutsModal.props = ['onClose']

export default ScriptShortcutsModal
