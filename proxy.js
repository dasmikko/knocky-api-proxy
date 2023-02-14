require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');

const app = express()
const port = 8080

const apiKey = process.env.APIKEY
const apiUrl = process.env.API_URL

app.get('/handleAuth', (req, res) => {
  const authToken = req.query.authorization

  if (!authToken) {
    res.status(500)
    res.send('Missing authorization key')
    return
  }

  axios({
    method: 'POST',
    url: `${apiUrl}/auth/request-token`,
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

app.use('/', proxy(apiUrl, {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    if (srcReq.headers.knockoutjwt) {
      proxyReqOpts.headers.authorization = srcReq.headers.knockoutjwt
    }

    proxyReqOpts.headers['user-agent'] = 'Knocky'
    delete proxyReqOpts.headers.knockoutjwt

    return proxyReqOpts;
  },
  proxyReqPathResolver: function (req) {
    const urlObj = new URL('http://example.com'+req.url)

    // Add api key to query if knockoutjwt is sent in the header
    if (req.headers.knockoutjwt) {
      urlObj.searchParams.append('key', apiKey)
    }

    return urlObj.href.replace('http://example.com', '');
  }
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))



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