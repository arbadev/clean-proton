'use strict'

import Controller from 'proton-controller'

export default class ThirdPartyController extends Controller {

  * createFirebaseToken() {
    try {
      const { user } = this.request
      const { FirebaseService } = proton.app.services
      const token = FirebaseService.generateToken(user._id.toString())
      this.response.status = 201
      this.response.body = { token }
    } catch (err) {
      proton.log.error('ThirdPartyController.createFirebaseToken', err)
      this.status = 400
    }
  }

}
