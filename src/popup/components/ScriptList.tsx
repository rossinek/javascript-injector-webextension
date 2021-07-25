
import { defineComponent, onMounted, PropType } from 'vue'
import styled from 'vue3-styled-components'
import { Cache } from '../../shared/cache'
import BaseButton from './BaseButton'

const ScriptSummary = styled.summary`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 14px;
  &:focus,
  &:focus-within {
    color: lightskyblue;
  }
  :not(:first-of-type) & {
    border-top: 1px solid #ccc;
    padding-top: 20px;
  }
`
const ScriptHosts = styled.span`
  &:hover {
    color: lightskyblue;
  }
`
const ScriptCode = styled.pre`
  background-color: #333;
  padding: 10px;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 12px;
`

const ScriptRemoveButton = styled(BaseButton)`
  color: #daa;
  font-size: 12px;
  flex-shrink: 0;
`

export default defineComponent({
  props: {
    cache: {
      type: Array as PropType<Cache>,
      default: () => [],
    },
    onRemove: {
      type: Function as PropType<(id: string) => void>
    }
  },
  emits: ['remove'],
  setup(props) {
    return () => props.cache.map(script => (
      <details key={script.id}>
        <ScriptSummary>
          <ScriptHosts>{ script.hosts.join(',') }</ScriptHosts>
          <ScriptRemoveButton
            class="shark-list__remove"
            type="button"
            text
            onClick={() => props.onRemove?.(script.id)}
          >
            remove
          </ScriptRemoveButton>
        </ScriptSummary>
        <ScriptCode>{ script.code }</ScriptCode>
      </details>
    ))
  }
})
