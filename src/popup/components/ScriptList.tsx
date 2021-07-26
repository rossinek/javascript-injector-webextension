
import { defineComponent, onMounted, PropType } from 'vue'
import styled from 'vue3-styled-components'
import { Cache, CachedScriptDefinition } from '../../shared/cache'
import BaseButton from './BaseButton'
import ScriptForm from './ScriptForm'

const ScriptListItem = styled.div`
  background-color: #333;
  border-radius: 8px;
  border: 1px solid #444;
  margin-bottom: 10px;
`
const ScriptListItemForm = styled(ScriptForm)`
  padding: 10px 15px;
`
const ScriptSummary = styled.summary`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 15px;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  &:focus,
  &:focus-within {
    color: lightskyblue;
  }
  :not(:first-of-type) & {
    border-top: 1px solid #ccc;
    padding-top: 20px;
  }
`
const ScriptSummaryContent = styled.div`
  margin-right: auto;
`
const ScriptHosts = styled.div`
  font-size: 12px;
  &:hover {
    color: lightskyblue;
  }
`
const ScriptOptions = styled.div`
  font-size: 10px;
  font-style: italic;
  opacity: 0.6;
`
const ScriptCode = styled.pre`
  margin: 0;
  background-color: #303030;
  border-top: 1px solid #444;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 10px;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 11px;
  white-space: pre-wrap;
`
const ScriptEditButton = styled(BaseButton)`
  font-size: 10px;
  flex-shrink: 0;
`
const ScriptRemoveButton = styled(BaseButton)`
  color: #daa;
  font-size: 10px;
  flex-shrink: 0;
`


export default defineComponent({
  props: {
    editScriptId: {
      type: String,
    },
    cache: {
      type: Array as PropType<Cache>,
      default: () => [],
    },
    onEdit: {
      type: Function as PropType<(id: string) => void>
    },
    onRemove: {
      type: Function as PropType<(id: string) => void>
    },
    onSave: {
      type: Function as PropType<(payload: CachedScriptDefinition) => void>
    },
    onCancelEdit: {
      type: Function as PropType<() => void>
    }
  },
  setup(props) {
    return () => props.cache.map(script => (
      <ScriptListItem>
        {props.editScriptId === script.id ? (
          <ScriptListItemForm
            script={script}
            onCancel={() => props.onCancelEdit?.()}
            onSubmit={payload => props.onSave?.({ ...payload, id: script.id })}
          />
        ) : (
          <details key={script.id}>
            <ScriptSummary>
              <ScriptSummaryContent>
                <ScriptHosts>{ script.hosts.join(',') }</ScriptHosts>
                {script.usesShortcuts && (
                  <ScriptOptions>uses shortcuts</ScriptOptions>
                )}
              </ScriptSummaryContent>
              <ScriptEditButton
                type="button"
                text
                onClick={() => props.onEdit?.(script.id)}
              >
                edit
              </ScriptEditButton>
              <ScriptRemoveButton
                type="button"
                text
                onClick={() => props.onRemove?.(script.id)}
              >
                remove
              </ScriptRemoveButton>
            </ScriptSummary>
            <ScriptCode>{ script.code }</ScriptCode>
          </details>
        )}
      </ScriptListItem>
    ))
  }
})
