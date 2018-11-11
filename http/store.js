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

class Store {
  constructor() {
    this.data = {
      user: {
        address: {
          street: 'Mustergasse',
        },
        alternate: {
          foo: 'bar',
        },
      },
    }
  }

  get(path) {
    return path.split('.').reduce((a, v) => a[v], this.data)
  }

  set(path, value) {
    const obj = this.data
    const keys = path.split('.')
    const lastKey = keys.pop()
    const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), obj)
    lastObj[lastKey] = value

    // console.log(this.data)
  }
}

window.store = new Store()
window.store.set('user.address.street', 'haufegasee')
console.log(window.store.get('user'))

//

window.events = window.events || {}
window.store = window.store || {}
window.get = window.get || function() {}
window.set = window.set || function() {}
window.listen = function(key, func) {
  window.addEventListener(key, func, false)
}
window.off = function(key, func) {
  window.removeEventListener(key, func, false)
}
window.emit = function(key, data) {
  // arguments[0] arguments[1]
  if (data) {
    window.dispatchEvent(new CustomEvent(key, data))
  } else {
    window.dispatchEvent(new Event(key))
  }
}
