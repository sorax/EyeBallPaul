const httpPort = process.env.npm_package_config_http_port
const wsPort = process.env.npm_package_config_ws_port

const express = require('express')
const app = express()

app.get('/config.js', function(req, res) {
  // const wsIp =
  //   address.family === 'IPv6' ? `[${address.address}]` : `${address.address}`
  // const wsAddress = `127.0.0.1:${wsPort}` //`${wsIp}:${wsPort}`
  // res.send(`const wsAddress = '${wsAddress}';`)

  res.set('Content-Type', 'text/javascript')
  res.send(`const wsAddress = '127.0.0.1:${wsPort}';`)

  // res.json({ testData: 'foobar' })
})

app.use(express.static('public'))

app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html')
})

app.listen(httpPort, function() {
  const family = this.address().family
  const host = this.address().address
  const port = this.address().port
  console.log(
    'EyeBallPaul Server listening at http://%s:%s (%s)',
    host,
    port,
    family,
  )
})
