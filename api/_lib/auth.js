const Auth = require(`@qnzl/auth`)

const {
  JWT_PUBLIC_KEY,
  ISSUER,
} = process.env

module.exports = (claim) => (req, res, next) => {
  const {
    authorization
  } = req.headers

  let [ type, token ] = authorization.split(' ')

  if (type && !token) {
    token = type
    type = 'Bearer'
  }

  console.log("AUTH:", token)
  if (!token) {
    return res.status(401).send()
  }

  const auth = new Auth(JWT_PUBLIC_KEY)

  const isTokenValid = auth.check(token, {
    desiredClaim: claim,
    subject: `watchers`,
    issuer: ISSUER,
  })

  if (!isTokenValid) {
    return res.status(401).send()
  }

  return next(req, res)
}
