const moment = require(`moment`)
const fetch = require(`node-fetch`)

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
} = process.env

const handler = async (req, res) => {
  const {
    projectId = ''
  } = req.query

  const scopes = `https://www.googleapis.com/auth/spreadsheets.readonly`

  const requestUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&state=${moment().valueOf()}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}`

  return res.send(requestUrl)
}

module.exports = (req, res) => {
  handler(req, res)
}

