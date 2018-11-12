////
// Polyfill for the CustomEvent() constructor functionality
// in Internet Explorer 9 and higher
////
;(function() {
  if (typeof window.CustomEvent === 'function') return false

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    const evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})()

// window.events = window.events || {}
window.listen = function(key, func) {
  window.addEventListener(key, func, false)
}
window.off = function(key, func) {
  window.removeEventListener(key, func, false)
}
window.emit = function(key, data) {
  // arguments[0] arguments[1]
  if (data) {
    window.dispatchEvent(
      new CustomEvent(key, {
        detail: data,
        // bubbles: true,
        // cancelable: true,
      }),
    )
  } else {
    window.dispatchEvent(new Event(key))
  }
}

window.listen('onStateChange', event => {
  console.log('state changed on path', event.detail)
})

class Store {
  constructor() {
    this._data = {}
  }

  get(path = '') {
    return path
      .split('.')
      .reduce(
        (obj, key) => (obj && obj[key] ? obj[key] : undefined),
        this._data,
      )
  }

  set(path, value) {
    if (JSON.stringify(value) !== JSON.stringify(this.get(path))) {
      window.emit('onStateChange', path)
      const obj = this._data
      const keys = path.split('.')
      const lastKey = keys.pop()
      const lastObj = keys.reduce(
        (obj, key) => (obj[key] = obj[key] || {}),
        obj,
      )
      lastObj[lastKey] = value
    }
  }
}
window.store = window.store || new Store()
window.store.set('a.b.c', { a: { b: { c: 2 } } })
