////
// Polyfill for the CustomEvent() constructor functionality
// in Internet Explorer 9 and higher
////
;(function() {
  if (typeof window.CustomEvent === 'function') return false

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})()

// class Store {
//   constructor() {
//     this._state = {}
//   }

//   get state() {
//     return this._state
//   }

//   set state(data) {
//     this._state = data
//   }
// }
// window.store = new Store()
// window.store.state = 'alice'
// console.log(window.store.state)

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
