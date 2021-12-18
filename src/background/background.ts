import 'content-scripts-register-polyfill';
import { browser, ContentScripts } from "webextension-polyfill-ts";
import {
  addCachedScript,
  updateCachedScript,
  removeCachedScript,
  CachedScriptDefinition,
  ScriptDefinition,
  readCache,
} from "../shared/cache"

// CLEAR ALL SCRIPTS
// browser.storage.local.set({ cache: [] })

const registered: Record<string, ContentScripts.RegisteredContentScript> = {}

const reloadList = () => {
  browser.runtime.sendMessage({ action: 'reloadList' });
}

const registerScript = async (script: ScriptDefinition | CachedScriptDefinition, skipReload?: boolean) => {
  let id = 'id' in script ? script.id : undefined

  if (id && registered[id]) {
    registered[id].unregister()
  }

  if (!id) {
    const cachedScript = await addCachedScript(script)
    id = cachedScript.id
  }

  registered[id] = await browser.contentScripts.register({
    matches: script.hosts,
    js: [
      ...(script.usesShortcuts ? [{ file: 'dist/content-scripts/shortcutListener.js' }] : []),
      { code: script.code }
    ],
    runAt: "document_idle"
  })

  if (!skipReload) reloadList()
}

const unregisterScript = async ({ id }: { id: string }) => {
  if (registered[id]) {
    registered[id].unregister()
  }
  await removeCachedScript(id)
  reloadList()
}

const updateScript = async (script: CachedScriptDefinition) => {
  await updateCachedScript(script)
  registerScript(script)
}

readCache().then(scripts => {
  scripts.forEach(script => registerScript(script, true))
})

browser.runtime.onMessage.addListener(({ action, payload }) => {
  switch (action) {
    case 'registerScript':
      registerScript(payload)
      break;
    case 'unregisterScript':
      unregisterScript(payload)
      break;
    case 'updateScript':
      updateScript(payload)
      break;
    default:
      break;
  }
});
