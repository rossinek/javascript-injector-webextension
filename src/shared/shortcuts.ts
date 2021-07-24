type ShortcutConfig = {
  handler: (event: KeyboardEvent) => void;
  preventOnInputs?: boolean;
}

const keyboardModifiers = {
  alt: 'altKey',
  cmd: 'metaKey',
  ctrl: 'ctrlKey',
  shift: 'shiftKey',
} as const

type ModifierName = keyof typeof keyboardModifiers

export type Shortcut = string
  // `${ModifierName}+${ModifierName}+${ModifierName}+${string}` |
  // `${ModifierName}+${ModifierName}+${string}` |
  // `${ModifierName}+${string}` |
  // `${string}`

const modifierKeys = Object.keys(keyboardModifiers) as ModifierName[]

const getShortcutModifiers = (shortcut: Shortcut) => shortcut.split('+').filter(k => modifierKeys.includes(k as ModifierName)).filter((k, i, all) => all.indexOf(k) === i)
const getShortcutKey = (shortcut: Shortcut) => shortcut.split('+').filter(k => !modifierKeys.includes(k as ModifierName))[0]

const isShortcut = (event: KeyboardEvent, shortcut: Shortcut) => {
  const shortcutModifiers = getShortcutModifiers(shortcut)
  const shortcutKey = getShortcutKey(shortcut)
  const usedModifiers = modifierKeys.filter(mod => event[keyboardModifiers[mod]])
  const correctModifiers = usedModifiers.length === shortcutModifiers.length && shortcutModifiers.every(mod => usedModifiers.includes(mod as ModifierName))
  return correctModifiers && event.key.toLowerCase() === shortcutKey
}

const registeredShortcuts: { [key in Shortcut]?: ShortcutConfig } = {}
const getRegisteredShortcuts = (): Shortcut[] => (Object.keys(registeredShortcuts) as Shortcut[]).filter(key => registeredShortcuts[key])

const inputSelectors = ['input', 'textarea', 'select'];
const inputSelectorsExceptions = ['input[type="checkbox"]'];

const hasActiveInput = () => {
  const activeEl = document.activeElement;
  return activeEl &&
    inputSelectors.some((s) => activeEl.matches(s)) &&
    !inputSelectorsExceptions.some((s) => activeEl.matches(s)) &&
    !(activeEl as HTMLInputElement).readOnly;
}

const keydownListener = (event: KeyboardEvent) => {
  getRegisteredShortcuts().forEach(shortcut => {
    if (isShortcut(event, shortcut)) {
      const shortcutConfig = registeredShortcuts[shortcut]!
      if (shortcutConfig.preventOnInputs && hasActiveInput()) return
      shortcutConfig.handler(event)
      event.preventDefault()
    }
  })
}

export const startListening = (element: GlobalEventHandlers = window) => {
  element.addEventListener('keydown', keydownListener)
}

export const stopListening = (element: GlobalEventHandlers = window) => {
  element.removeEventListener('keydown', keydownListener)
}

export const isValidShortcut = (_shortcut: unknown, silent: boolean = false): _shortcut is Shortcut => {
  const shortcut = `${_shortcut}`
  if (shortcut.toLowerCase() !== shortcut) {
    if (!silent) console.error('[Javascript Injector Extension] Invalid shortcut: keys must be lower case')
    return false
  }
  const modifiers = getShortcutModifiers(shortcut as Shortcut)
  const parts = shortcut.split('+')
  if (parts.length !== modifiers.length + 1) {
    if (!silent) console.error('[Javascript Injector Extension] Invalid shortcut: must contain at most one occurrence of each modifier and exactly one other key')
    return false
  }
  if (!parts.slice(0, -1).every(part => modifierKeys.includes(part as ModifierName))) {
    if (!silent) console.error('[Javascript Injector Extension] Invalid shortcut: modifiers should appear at the beginning of shortcut')
    return false
  }
  return true
}

const normalizeShortcut = (shortcut: Shortcut) => {
  const parts = shortcut.split('+')
  return parts.slice(0, -1).sort().join('+') + parts[parts.length - 1]
}

export const registerShortcut = (shortcut: Shortcut, options: ShortcutConfig | ShortcutConfig['handler']) => {
  if (isValidShortcut(shortcut)) {
    registeredShortcuts[normalizeShortcut(shortcut)] = typeof options === 'function' ? { handler: options } : options
  }
}

export const unregisterShortcut = (shortcut: Shortcut) => {
  delete registeredShortcuts[normalizeShortcut(shortcut)]
}

export const unregisterAllShortcuts = () => getRegisteredShortcuts().forEach(unregisterShortcut)
