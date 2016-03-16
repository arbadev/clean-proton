'use strict'

import Policy from 'proton-policy'
import _ from 'lodash'

export default class  AuthPolicies extends Policy {

  constructor(proton) {
    super(proton)
  }

  * facebook(next) {
    const self = this
    const opts = { session: false }
    const cb = function * (err, user) {
      if (err) return self.response.status = 401
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
      if (err || !user) return self.status = 401
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
      if (err || info.indexOf(withoutUser) === -1) return self.status = 401
      yield next
    }
    try {
      yield passport.authenticate('bearer', opts, cb).call(this)
    } catch (err) {
      proton.log.error(err)
    }
  }
}
