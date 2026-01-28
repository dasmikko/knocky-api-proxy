require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser');

const app = express()
const port = 8080

const apiKey = process.env.APIKEY
const apiUrl = process.env.API_URL.replace(/\/+$/, '')

// parse request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.raw({ type: '*/*' }))

app.get('/handleAuth', (req, res) => {
  const authToken = req.query.authorization

  if (!authToken) {
    res.status(500)
    res.send('Missing authorization key')
    return
  }

  if (!apiKey) {
    res.status(500)
    res.send('Missing api key')
    return
  }

  axios.post(`${apiUrl}/auth/request-token`, {
    'authorization': authToken
  }, {
    params: {
      key: apiKey
    },
    headers: {
      'user-agent': 'Knocky'
    },
  }).then(function (response) {
    // handle success
    res.redirect('knocky://finishAuth/'+response.data.token)
  })
  .catch(function (error) {
    // handle error
    res.send(error.response.data)
  })
  .then(function () {
    // always executed
  })

  /*axios({
    method: 'POST',
    url: `${apiUrl}/auth/request-token`,
    params: {
      key: apiKey
    },
    headers: {
      'user-agent': 'Knocky',
    },
    data: {
      'authorization': authToken
    },
  }).then(function (response) {
    // handle success
    res.redirect('knocky://finishAuth/'+response.data.token)
  })
    .catch(function (error) {
      // handle error
      res.send(error.response.data)
    })
    .then(function () {
      // always executed
    })*/
})

app.all('/*', (req, res) => {
  const headers = {
    'user-agent': 'Knocky',
  }

  if (req.headers.knockoutjwt) {
    headers['authorization'] = req.headers.knockoutjwt
  }

  if (req.headers['content-type']) {
    headers['content-type'] = req.headers['content-type']
  }

  if (req.headers['content-format-version']) {
    headers['content-format-version'] = req.headers['content-format-version']
  }

  if (req.headers['accept']) {
    headers['accept'] = req.headers['accept']
  }

  const clientIp = req.ip || req.connection.remoteAddress
  headers['x-forwarded-for'] = req.headers['x-forwarded-for']
    ? `${req.headers['x-forwarded-for']}, ${clientIp}`
    : clientIp

  const params = { ...req.query }
  if (req.headers.knockoutjwt) {
    params.key = apiKey
  }

  const targetUrl = `${apiUrl}${req.path}`

  axios({
    method: req.method,
    url: targetUrl,
    headers: headers,
    params: params,
    data: req.body,
    validateStatus: () => true,
  })
    .then(function (response) {
      res.status(response.status).send(response.data)
    })
    .catch(function (error) {
      if (error.response) {
        res.status(error.response.status).send(error.response.data)
      } else {
        res.status(502).send('Proxy error')
      }
    })
})

// Export the app for serverless use (Netlify)
module.exports = app

// Start the server if run directly (e.g. node proxy.js)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Knocky api proxy is running on port ${port}`)
  })
}
