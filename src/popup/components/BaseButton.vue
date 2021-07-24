<template>
  <button
    :class="{
      'base-button': true,
      'base-button--text': text,
    }"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: Boolean,
  },
})
</script>

<style lang="scss" scoped>
.base-button {
  position: relative;
  text-transform: uppercase;
  background-color: var(--c-primary);
  color: #fff;
  padding: 0px 12px;
  border: 0;
  border-radius: 3px;
  font-size: 13px;
  line-height: 30px;
  font-weight: 500;
  letter-spacing: 1.25px;
  overflow: hidden;
  transition: box-shadow .2s;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.15);
  outline: 0;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
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
}
.base-button--text {
  color: var(--c-primary);
  &::before {
    background-color: currentColor;
  }
}
.base-button--text {
  background-color: transparent;
  box-shadow: none;
}
</style>
