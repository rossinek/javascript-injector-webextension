'use strict';

const readCache = async () => {
  const { cache } = await browser.storage.local.get('cache').catch(() => ({ cache: [] }))
  return cache ? cache.slice() : []
}

const hasForm = () => !!document.querySelector('form.shark-form')

const createForm = async () => {
  if (hasForm()) return

  const template = document.querySelector('form.shark-form-template')
  const form = template.cloneNode(true)

  form.className = 'shark-form'
  document.querySelector('.shark-form-wrapper').prepend(form)

  const hostsInput = document.querySelector('.shark-form [name="hosts"]')
  const codeInput = document.querySelector('.shark-form [name="code"]')
  const currentUrl = await browser.tabs.query({ active:true, currentWindow:true })
    .then((tabs) => tabs[0].url)
    .catch(() => null)
  const defaultHosts = currentUrl || "*://*.com/*";
  const defaultCode = "document.body.innerHTML = '<h1>This page has been eaten</h1>'";
  hostsInput.value = defaultHosts;
  codeInput.value = defaultCode;

  const cancel = () => form.remove()
  const cancelButton = document.querySelector('.shark-form button[name="cancel"')
  cancelButton.addEventListener('click', cancel);

  form.addEventListener('submit', async event => {
    event.preventDefault()
    const hosts = document.querySelector('.shark-form [name="hosts"]').value.split(",")
    const code = document.querySelector('.shark-form [name="code"]').value
    browser.runtime.sendMessage({ action: 'registerScript', item: { hosts, code } });
    cancel()
    // renderList()
  })
}

const renderList = async () => {
  const listWrapper = document.querySelector('.shark-list')
  listWrapper.innerHTML = ''
  const cache = await readCache()
  cache.forEach(({ id, hosts, code }) => {
    const details = document.querySelector('.shark-list__item-template').cloneNode(true)
    const uniqueClass = `item-${id}`
    details.className = `shark-list__item ${uniqueClass}`
    listWrapper.appendChild(details)
    const hostsEl = document.querySelector(`.${uniqueClass} .shark-list__hosts`)
    const codeEl = document.querySelector(`.${uniqueClass} .shark-list__code`)
    hostsEl.textContent = hosts
    codeEl.textContent = code

    const removeButton = document.querySelector(`.${uniqueClass} .shark-list__remove`)
    removeButton.addEventListener('click', async () => {
      browser.runtime.sendMessage({ action: 'unregisterScript', id });
      // renderList()
    })
  })
}

// CLEAR ALL SCRIPTS
// browser.storage.local.set({ cache: [] })

renderList()

document
  .querySelector('.shark-form-wrapper button[name="add"')
  .addEventListener('click', () => {
    createForm()
  });

browser.runtime.onMessage.addListener((payload) => {
  console.log('message!', payload)
  switch (payload.action) {
    case 'reloadList':
      renderList()
      break;
    default:
      break;
  }
});
