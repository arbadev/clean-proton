'use strict'

import Controller from 'proton-controller'

export default class AuthController extends Controller {

  * authenticate() {
    const response = {}
    try {
      const token = yield Token.generate(this.request.user.id)
      response.token = token.value
      response.user = yield User.findOneById(token.user)
      this.response.body = response
    } catch (err) {
      proton.log.error(err)
      this.response.status = 400
    }
  }

}
