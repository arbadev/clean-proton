'use strict'

import Strategy from 'passport-facebook-token'
import _ from 'lodash'


export default class FacebookStrategy extends Strategy {

  constructor() {
    super(FacebookStrategy.opts(), FacebookStrategy.strategy)
  }

  static strategy(accessToken, refreshToken, profile, done) {
    done(null, _.clone(profile))
  }

  static opts() {
    return {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }
  }
}
