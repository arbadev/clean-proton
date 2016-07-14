'use strict'

import Controller from 'proton-controller'

export default class StorageController extends Controller {

  * generateCloudinarySignature() {
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

  * generateBucketSignedUri() {
    try {
      const { BucketService } = proton.app.services
      const response = BucketService.generateBucketObject()
      this.response.status = 201
      this.response.body = response
    } catch (err) {
      proton.log.error('StorageController. generateBucketSignedUri', err)
      this.status = 400
    }
  }

}
