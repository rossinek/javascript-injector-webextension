import styled from 'vue3-styled-components';

export default styled('button', { text: Boolean })`
  font-family: "Gill Sans", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  position: relative;
  text-transform: uppercase;
  background-color: ${props => props.text ? 'transparent' : 'var(--c-primary)'};
  color: ${props => props.text ? 'var(--c-primary)' : '#fff'};
  padding: 0 1em;
  border: 0;
  border-radius: 3px;
  font-size: 13px;
  line-height: 2.5em;
  font-weight: 500;
  letter-spacing: 0.1em;
  overflow: hidden;
  transition: box-shadow 0.2s;
  cursor: pointer;
  text-decoration: none;
  box-shadow: ${props => props.text ? 'none' : '0px 1px 4px 1px rgba(0, 0, 0, 0.15)'};
  outline: 0;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => props.text ? 'currentColor' : '#fff'};;
    opacity: 0;
  }
  &:focus, &:active {
    outline: none;
  }
  &:active {
    box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.3);
  }
  &:hover::before {
    opacity: 0.09;
  }
  &:focus::before {
    opacity: 0.14;
  }
  &:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
`
