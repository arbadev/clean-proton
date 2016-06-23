'use strict'

import Policy from 'proton-policy'

export default class AuthPolicies extends Policy {

  * facebook(next) {
    const self = this
    const opts = { session: false }
    const cb = function * (err, user) {
      if (err) {
        proton.log.debug('error', err)
        self.response.status = 401
        return self
      }
      self.request.user = user
      yield next
    }
    try {
      yield passport.authenticate('facebook-token', opts, cb).call(this)
    } catch (err) {
      proton.log.error(err)
    }
  }

  * bearer(next) {
    const self = this
    const opts = { session: false }
    const cb = function * (err, user, scope) {
      if (err || !user) {
        proton.log.error('Error on bearer strategy', err, user)
        self.response.status = 401
        return self
      }
      self.request.user = user
      self.request.scope = scope
      yield next
    }
    try {
      yield passport.authenticate('bearer', opts, cb).call(this)
    } catch (err) {
      proton.log.error(err)
    }
  }

  * bearerWithoutUser(next) {
    const self = this
    const opts = { session: false }
    const withoutUser = 'error_description="without user"'
    const cb = function * (err, user, info) {
      if (err || info.indexOf(withoutUser) === -1) {
        self.response.status = 401
        return self
      }
      yield next
    }
    try {
      yield passport.authenticate('bearer', opts, cb).call(this)
    } catch (err) {
      proton.log.error(err)
    }
  }
}
