import { css } from 'vue3-styled-components'

declare module 'vue3-styled-components' {
  export const injectGlobal: typeof css;
}
