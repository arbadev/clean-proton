'use strict'

import { Strategy } from 'passport-http-bearer'

export default class BearerStrategy extends Strategy {

  constructor() {
    super(BearerStrategy.strategy)
  }

  static strategy(token, done) {
    Token.findOneByValue(token)
      .then(token => Promise.all([token, User.me(token.user)]))
      .then(([token, user]) => {
        if (!user) return done(null, user, 'without user')
        return done(null, user, token.scope)
      })
      .catch(err => done(err))
  }
}
