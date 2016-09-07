'use strict'

import Policy from 'proton-policy'

const opts = { session: false }

export default class AuthPolicies extends Policy {

  * facebook(next) {
    const cb = function * (err, profile) {
      if (err) {
        proton.log.error('Error on facebook strategy', err)
        this.response.status = 401
        return this
      }
      this.request.facebookId = profile.id
      return yield next
    }.bind(this)
    try {
      yield passport.authenticate('facebook-token', opts, cb).call(this)
    } catch (err) {
      proton.log.error(err)
    }
  }

  * bearer(next) {
    const cb = function * (err, user, scope) {
      if (err || !user) {
        proton.log.error('Error on bearer strategy', err, user)
        this.response.status = 401
        return this
      }
      this.request.user = user
      this.request.scope = scope
      return yield next
    }.bind(this)
    try {
      yield passport.authenticate('bearer', opts, cb).call(this)
    } catch (err) {
      proton.log.error(err)
    }
  }

  * bearerWithoutUser(next) {
    const withoutUser = 'error_description="without user"'
    const cb = function * (err, user, info) {
      if (err || info.indexOf(withoutUser) === -1) {
        proton.log.error('Error on bearer strategy without user', err, user)
        this.response.status = 401
        return this
      }
      return yield next
    }.bind(this)
    try {
      yield passport.authenticate('bearer', opts, cb).call(this)
    } catch (err) {
      proton.log.error(err)
    }
  }

}
