'use strict'

import Controller from 'proton-controller'

export default class CloudinaryController extends Controller {

  * getSignature() {
    try {
      const {CloudinaryService} = proton.app.services
      const response = CloudinaryService.generateSignatureObject()
      this.response.status = 200
      this.response.body = response
    } catch(err) {
      proton.log.debug(err)
      this.status = 400
    }
  }

}
