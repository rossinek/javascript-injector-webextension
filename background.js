'use strict';

const saveCache = async (cache) => {
  await browser.storage.local.set({ cache })
}

const readCache = async () => {
  const { cache } = await browser.storage.local.get('cache').catch(() => ({ cache: [] }))
  return cache ? cache.slice() : []
}

const removeFromCache = async (id) => {
  const cache = await readCache()
  await saveCache(cache.filter(i => i.id !== id))
}

const generateId = () => `${Date.now()}_${Math.random()}`.replace(/\./g, '_')

const registered = {}

const reloadList = () => {
  browser.runtime.sendMessage({ action: 'reloadList' });
}

const registerScript = async (item, skipReload) => {
  const { hosts, code } = item
  let id = item.id

  if (id && registered[id]) {
    registered[id].unregister()
  }

  if (!id) {
    id = generateId()
    const cache = await readCache()
    cache.push({ id, hosts, code })
    await saveCache(cache)
    console.log('saved')
  }

  registered[id] = await browser.contentScripts.register({
    matches: hosts,
    js: [{ code }],
    runAt: "document_idle"
  });


  if (!skipReload) reloadList()
}

const unregisterScript = async (id) => {
  if (registered[id]) {
    registered[id].unregister()
  }
  await removeFromCache(id)
  reloadList()
}

readCache().then(items => {
  console.log(items)
  items.forEach(item => registerScript(item, true))
})

browser.runtime.onMessage.addListener((payload) => {
  switch (payload.action) {
    case 'registerScript':
      registerScript(payload.item)
      break;
    case 'unregisterScript':
      unregisterScript(payload.id)
      break;
    default:
      break;
  }
});
