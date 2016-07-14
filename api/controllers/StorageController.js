'use strict'

import Controller from 'proton-controller'

export default class StorageController extends Controller {

  * createCloudinarySignature() {
    try {
      const { CloudinaryService } = proton.app.services
      const response = CloudinaryService.generateSignatureObject()
      this.response.status = 201
      this.response.body = response
    } catch (err) {
      proton.log.error('StorageController.createCloudinarySignature', err)
      this.status = 400
    }
  }

}
