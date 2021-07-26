import { browser } from "webextension-polyfill-ts";

export type Cache = CachedScriptDefinition[]

export type ScriptDefinition = {
  hosts: string[];
  code: string;
  usesShortcuts?: boolean;
}

export type CachedScriptDefinition = ScriptDefinition & { id: string }

const generateId = () => `${Date.now()}_${Math.random()}`.replace(/\./g, '_')

export const saveCache = async (cache: Cache) => {
  await browser.storage.local.set({ cache })
}

export const readCache = async (): Promise<Cache> => {
  const { cache } = await browser.storage.local.get('cache').catch(() => ({ cache: [] }))
  return cache ? cache.slice() : []
}

export const addCachedScript = async (scriptDefinition: ScriptDefinition) => {
  const script = { ...scriptDefinition, id: generateId()}
  const cache = await readCache()
  cache.push(script)
  await saveCache(cache)
  return script
}

export const removeCachedScript = async (id: string) => {
  const cache = await readCache()
  await saveCache(cache.filter(i => i.id !== id))
}

export const updateCachedScript = async (updatedScript: CachedScriptDefinition) => {
  const cache = await readCache()
  const scriptIndex = cache.findIndex(script => script.id === updatedScript.id)
  if (scriptIndex < 0) {
    throw new Error('[Javascript Injector Extension] Update script: No such script in cache')
  }
  cache.splice(scriptIndex, 1, updatedScript)
  await saveCache(cache)
}
