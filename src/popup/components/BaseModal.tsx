import { Teleport, withModifiers, SetupContext, FunctionalComponent } from 'vue'
import styled from 'vue3-styled-components';

const ModalContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.87);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  & ::v-deep > * {
    cursor: default;
  }
`

type Props = {
  onClose?: () => void
}

const BaseModal: FunctionalComponent<Props> = (props, { slots }) => (
  <Teleport to="#modal-target">
    <ModalContent onClick={withModifiers(() => props.onClose?.(), ["self"])}>
      {slots.default?.()}
    </ModalContent>
  </Teleport>
)

BaseModal.props = ['onClose']

export default BaseModal
