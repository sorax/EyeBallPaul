const httpPort = process.env.npm_package_config_http_port
const wsPort = process.env.npm_package_config_ws_port

const express = require('express')
const app = express()

let host

app.get('/config.js', (req, res) => {
  res.set('Content-Type', 'text/javascript')
  res.send(`export const wsAddress = '${host}:${wsPort}'`)
})

app.use(express.static('public'))

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html')
})

app.listen(httpPort, function() {
  const family = 'IPv4'
  // const family = this.address().family
  // const ip = '127.0.0.1'
  const ip = '192.168.0.12'
  // const ip = this.address().address
  const port = this.address().port
  host = family === 'IPv6' ? `[${ip}]` : `${ip}`

  console.log('WebServer is now listening on http://%s:%s', host, port)
})
