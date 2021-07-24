import { browser } from "webextension-polyfill-ts";

export type Cache = CachedScriptDefinition[]

export type ScriptDefinition = {
  hosts: string[];
  code: string;
  usesShortcuts?: boolean;
}

export type CachedScriptDefinition = ScriptDefinition & { id: string }

export const saveCache = async (cache: Cache) => {
  await browser.storage.local.set({ cache })
}

export const readCache = async (): Promise<Cache> => {
  const { cache } = await browser.storage.local.get('cache').catch(() => ({ cache: [] }))
  return cache ? cache.slice() : []
}

export const removeFromCache = async (id: string) => {
  const cache = await readCache()
  await saveCache(cache.filter(i => i.id !== id))
}

export const generateId = () => `${Date.now()}_${Math.random()}`.replace(/\./g, '_')
