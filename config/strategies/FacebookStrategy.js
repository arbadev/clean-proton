'use strict'

import Strategy from 'passport-facebook-token'
import _ from 'lodash'


export default class FacebookStrategy extends Strategy {

  constructor() {
    super(FacebookStrategy.opts(), FacebookStrategy.strategy)
  }

  static strategy(accessToken, refreshToken, profile, done) {
    const user = _.clone(profile)
    done(null, user)
  }

  static opts() {
    return {
      clientID: process.env.FACEBOOK_CLIENT_ID || '123456789',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '123456789',
    }
  }
}
