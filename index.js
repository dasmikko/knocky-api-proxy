require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser');
const {head} = require('axios')

const app = express()
const port = 8080

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const apiKey = process.env.APIKEY

const knockoutApi = axios.create({
  baseURL: 'https://api.knockout.chat/',
});

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
    res.send(error.response.data)
  })
  .then(function () {
    // always executed
  })
})

app.get('/*', async (req, res) => {
  let params = {}
  let headers = {
    userAgent: 'Knocky'
  }

  if (req.headers.knockoutjwt) {
    params.key = apiKey
    headers.authorization = req.headers.knockoutjwt
  }

  if (req.headers['x-forwarded-for']) {
    headers['x-forwarded-for'] = req.headers['x-forwarded-for']
  }

  if (req.headers['x-forwarded-for']) {
    headers['x-forwarded-for'] = req.headers['x-forwarded-for']
  }

  if (req.headers['Access-Control-Request-Headers']) {
    headers['Access-Control-Request-Headers'] = req.headers['Access-Control-Request-Headers']
  }

  if (req.headers['content-format-version']) {
    headers['content-format-version'] = req.headers['content-format-version']
  }

  try {
    const apiResponse = await knockoutApi.get(req.params[0], {
      params: params,
      headers: headers
    })
    res.send(apiResponse.data)
  } catch (err) {
    console.error(err)
    res.status(err.response.status)
    res.send(err.response.data.message)
  }
})

app.post('/*', async (req, res) => {
  let params = {}
  let headers = {
    userAgent: 'Knocky',
  }

  if (req.headers.knockoutjwt) {
    params.key = apiKey
    headers.authorization = req.headers.knockoutjwt
  }

  if (req.headers['x-forwarded-for']) {
    headers['x-forwarded-for'] = req.headers['x-forwarded-for']
  }

  if (req.headers['Access-Control-Request-Headers']) {
    headers['Access-Control-Request-Headers'] = req.headers['Access-Control-Request-Headers']
  }

  if (req.headers['content-format-version']) {
    headers['content-format-version'] = req.headers['content-format-version']
  }

  try {
    const apiResponse = await knockoutApi.post(req.params[0], req.body,{
      params: params,
      headers: headers
    })
    res.send(apiResponse.data)
  } catch (err) {
    res.status(err.response.status)
    res.send(err.response.data.message)
  }
})

app.put('/*', async (req, res) => {
  let params = {}
  let headers = {
    userAgent: 'Knocky',
  }

  if (req.headers.knockoutjwt) {
    params.key = apiKey
    headers.authorization = req.headers.knockoutjwt
  }

  if (req.headers['x-forwarded-for']) {
    headers['x-forwarded-for'] = req.headers['x-forwarded-for']
  }

  if (req.headers['Access-Control-Request-Headers']) {
    headers['Access-Control-Request-Headers'] = req.headers['Access-Control-Request-Headers']
  }

  if (req.headers['content-format-version']) {
    headers['content-format-version'] = req.headers['content-format-version']
  }

  try {
    const apiResponse = await knockoutApi.put(req.params[0], req.body,{
      params: params,
      headers: headers
    })
    res.send(apiResponse.data)
  } catch (err) {
    res.status(err.response.status)
    res.send(err.response.data.message)
  }
})

app.delete('/*', async (req, res) => {
  let params = {}
  let headers = {
    userAgent: 'Knocky',
  }

  if (req.headers.knockoutjwt) {
    params.key = apiKey
    headers.authorization = req.headers.knockoutjwt
  }

  if (req.headers['x-forwarded-for']) {
    headers['x-forwarded-for'] = req.headers['x-forwarded-for']
  }

  if (req.headers['Access-Control-Request-Headers']) {
    headers['Access-Control-Request-Headers'] = req.headers['Access-Control-Request-Headers']
  }

  if (req.headers['content-format-version']) {
    headers['content-format-version'] = req.headers['content-format-version']
  }

  try {
    const apiResponse = await knockoutApi.delete(req.params[0],{
      params: params,
      headers: headers
    })
    res.send(apiResponse.data)
  } catch (err) {
    res.status(err.response.status)
    res.send(err.response.data.message)
  }
})

app.listen(port, () => {
  console.log(`....:^^............................................^^^.................................. ...........
...:&@G...........................................^&@P.................................~Y^ ..^BB?...
...J@@! .!JJ~.~J?:~?J?~.....^7JJJ!:.....^7JJ?!:...5@@~ .!Y?^...~?JJ?~:...^JJ^...~JJ::J5@@G?..5@@~...
...#@#.7#&G!..#@@GP5#@@J..?#@BYYG@@5..~#@&5YB@&!.:&@G.?#&G~..5&&PYY#@&7..G@@:...#@&::5@@#J?..&@G....
..!@@#&@#:...~@@G.. !@@J Y@@J.. .#@@^^&@#.  .~~^.?@@#&@B:...B@@~ . :@@#.^@@P...!@@Y. ?@@! ..!@@~....
..B@&JY@@7...P@@^...G@&:.#@@: . ^@@B.Y@@? ..^^:..#@&JP@&!..^@@B... J@@J 5@@^ ..B@@^..#@#....7BY.....
.~@@P .5@@7.:@@B...^@@P..?&@BJ?5&&5:.^&@&J?G@&7.!@@Y .G@@~..P@@P?JG@&?..P@@GY5B@@G..:&@&J^.7BB~.....
.~YY:...JY?.^YY^...~YY^...:!J5YJ!:.....!JYYJ!:..!YY:..:JY?...^7Y5Y?^.....!JYJ~^YY^...~JYY^.75Y:.....
`)

  console.log(`Knocky api proxy is running on port ${port}`)
})