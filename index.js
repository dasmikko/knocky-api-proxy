require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
const port = 8080

const apiKey = process.env.APIKEY

app.get('/', (req, res) => {
  res.send('Hi there! This is the auth API for Knocky. There really isn\'t anything cool to find around here...')
})

app.get('/handleAuth', (req, res) => {
  const authToken = req.query.authorization

  axios({
    method: 'POST',
    url: `https://api.knockout.chat/auth/request-token`,
    params: {
      key: apiKey
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
    console.log(error)
    res.send(error.response.data)
  })
  .then(function () {
    // always executed
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})