import { browser, ContentScripts } from "webextension-polyfill-ts";
import {
  generateId,
  readCache,
  removeFromCache,
  saveCache,
  CachedScriptDefinition,
  ScriptDefinition,
} from "../shared/cache"

// CLEAR ALL SCRIPTS
// browser.storage.local.set({ cache: [] })

const registered: Record<string, ContentScripts.RegisteredContentScript[]> = {}

const reloadList = () => {
  browser.runtime.sendMessage({ action: 'reloadList' });
}

const registerScript = async (item: ScriptDefinition | CachedScriptDefinition, skipReload?: boolean) => {
  const { hosts, code, usesShortcuts } = item
  let id = 'id' in item ? item.id : undefined

  if (id && registered[id]) {
    registered[id].forEach(script => script.unregister())
  }

  if (!id) {
    id = generateId()
    const cache = await readCache()
    cache.push({
      id,
      hosts,
      code,
      usesShortcuts,
    })
    await saveCache(cache)
  }

  registered[id] = [
    await browser.contentScripts.register({
      matches: hosts,
      js: [
        ...(usesShortcuts ? [{ file: 'dist/content-scripts/shortcutListener.js' }] : []),
        { code }
      ],
      runAt: "document_idle"
    })
  ];

  if (!skipReload) reloadList()
}

const unregisterScript = async ({ id }: { id: string }) => {
  if (registered[id]) {
    registered[id].forEach(script => script.unregister())
  }
  await removeFromCache(id)
  reloadList()
}

readCache().then(items => {
  console.log(items)
  items.forEach(item => registerScript(item, true))
})

browser.runtime.onMessage.addListener(({ action, payload }) => {
  switch (action) {
    case 'registerScript':
      registerScript(payload)
      break;
    case 'unregisterScript':
      unregisterScript(payload)
      break;
    default:
      break;
  }
});
