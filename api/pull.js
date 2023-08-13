const authCheck = require(`./_lib/auth`)
const moment = require(`moment-timezone`)
const fetch = require(`node-fetch`)
const auth = require(`@qnzl/auth`)

const { CLAIMS } = auth

const handler = async (req, res) => {
}

module.exports = (req, res) => {
  return authCheck(CLAIMS.withings.dump)(req, res, handler)
}
