import Service from 'proton-service'
import request from 'request-promise'
import jsrsasign from 'jsrsasign'

const privateKey = process.env.LAYER_PRIVATE_KEY.replace(/\\n/g, '\n')


export default class LayerService extends Service {

  * createSession(opts) {
    const { user, nonce } = opts
    // const { nonce } = JSON.parse(yield getNonce())
    return getIdentityToken(user, nonce)
  }

}

function getNonce() {
  const opts = {
    uri: `${process.env.LAYER_URI}/nonces`,
    headers: {
      'Accept': 'application/vnd.layer+json; version=1.0',
    },
    method: 'POST',
  }
  return request(opts)
}

function getSessionToken(identityToken) {
  const opts = {
    uri: `${process.env.LAYER_URI}/sessions`,
    json: {
      identity_token: identityToken,
      app_id: process.env.LAYER_APP_ID,
    },
    headers: {
      'Accept': 'application/vnd.layer+json; version=1.0',
    },
    method: 'POST',
  }
  return request(opts)
}

function getIdentityToken(user, nonce) {
  const header = JSON.stringify({
    typ: 'JWT',
    alg: 'RS256',
    cty: 'layer-eit;v=1',
    kid: process.env.LAYER_KEY_ID,
  })

  const currentTimeInSeconds = Math.round(new Date() / 1000)
  const expirationTime = currentTimeInSeconds + 10000

  const claim = JSON.stringify({
    iss: process.env.LAYER_PROVIDER_ID,
    prn: user,
    iat: currentTimeInSeconds,
    exp: expirationTime,
    nce: nonce,
  })

  try {
    return jsrsasign.jws.JWS.sign('RS256', header, claim, privateKey)
  } catch (err) {
    console.log('error error', err)
  }
}
