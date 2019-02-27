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
window.on = function(key, func) {
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
        bubbles: false,
        // cancelable: true,
      }),
    )
  } else {
    window.dispatchEvent(new Event(key))
  }
}

window.on('onStateChange', event => {
  console.log('state changed on path', event.detail)
})

function State() {
  var data = {}

  this.get = path => {
    return !path
      ? data
      : path
          .split('.')
          .reduce((obj, key) => (obj && obj[key] ? obj[key] : undefined), data)
  }

  this.set = (path, value) => {
    if (JSON.stringify(value) !== JSON.stringify(this.get(path))) {
      window.emit('onStateChange', path)

      const keys = path.split('.')
      const lastKey = keys.pop()
      const lastObj = keys.reduce(
        (obj, key) => (obj[key] = obj[key] || {}),
        data,
      )
      lastObj[lastKey] = value
    }
  }

  // this.watch = (path, func) => {
  //   // onStateChange
  //   console.log('WATCH', path, func)
  // }
}
window.state = window.state || new State()

// window.state.watch('a.b.c', event => {
//   console.log('state changed on path', event.detail)
// })
