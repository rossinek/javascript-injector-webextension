import {
  registerShortcut,
  startListening,
  unregisterAllShortcuts,
  unregisterShortcut
} from "../shared/shortcuts";

declare global {
  interface Window {
    ShortcutService: typeof ShortcutService;
  }
}

const ShortcutService = {
  registerShortcut,
  unregisterShortcut,
  unregisterAllShortcuts,
}

if (!window.ShortcutService) {
  startListening(window)
  window.ShortcutService = ShortcutService
  ;(window as any).__sth = 'ShortcutService'
}
