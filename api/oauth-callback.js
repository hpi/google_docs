const { URLSearchParams } = require(`url`)
const fetch = require(`node-fetch`)

module.exports = async (req, res) => {
  const { code } = req.query

  const body = new URLSearchParams()
  body.append(`code`, code)
  body.append(`client_id`, process.env.GOOGLE_CLIENT_ID)
  body.append(`client_secret`, process.env.GOOGLE_CLIENT_SECRET)
  body.append(`redirect_uri`, process.env.GOOGLE_REDIRECT_URI)
  body.append(`grant_type`, `authorization_code`)

  fetch(`https://oauth2.googleapis.com/token`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`
      },
      body
    })
    .then(async (response) => {
      const token = await response.json()

      // TODO Do something with the token
      console.log(`got google token: ${token}`)

      return res.status(200).send(token)
    })
}

