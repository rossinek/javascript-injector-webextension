<template>
  <details
    v-for="script in cache"
    :key="script.id"
    class="shark-list__item-template"
  >
    <summary class="shark-list__item-summary">
      <span class="shark-list__hosts">{{ script.hosts.join(',') }}</span>
      <BaseButton
        class="shark-list__remove"
        type="button"
        text
        @click="$emit('remove', script.id)"
      >
        remove
      </BaseButton>
    </summary>
    <pre class="shark-list__code">{{ script.code }}</pre>
  </details>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue'
import { Cache } from '../../shared/cache'
import BaseButton from './BaseButton.vue'

export default defineComponent({
  components: {
    BaseButton
  },
  props: {
    cache: Array as PropType<Cache>
  },
})
</script>

<style scoped>
.shark-list__item-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 14px;
}
.shark-list__item-summary:focus,
.shark-list__hosts:hover,
.shark-list__hosts:focus {
  color: lightskyblue;
}
:not(:first-of-type) .shark-list__item-summary {
  border-top: 1px solid #ccc;
  padding-top: 20px;
}
.shark-list__code {
  background-color: #333;
  padding: 10px;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 14px;
}
.shark-list__remove {
  color: #daa;
  font-size: 12px;
  flex-shrink: 0;
}
</style>
