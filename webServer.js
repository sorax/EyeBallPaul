const httpPort = process.env.npm_package_config_http_port
const wsPort = process.env.npm_package_config_ws_port

const express = require('express')
const app = express()

let address

app.get('/config.js', (req, res) => {
  res.set('Content-Type', 'text/javascript')
  res.send(`const wsAddress = '${address}';`)
})

app.use(express.static('public'))

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html')
})

app.listen(httpPort, function() {
  const family = this.address().family
  const ip = this.address().address
  const port = this.address().port
  const host = family === 'IPv6' ? `[${ip}]` : `${ip}`

  address = `${host}:${port}`

  console.log('WebServer is now listening on http://%s', address)
})
