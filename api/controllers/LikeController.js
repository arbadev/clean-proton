'use strict'

import Controller from 'proton-controller'

export default class LikeController extends Controller {

  /**
   *
   *
   */
  * create() {
    try {
      this.status = 204
    } catch (err) {
      proton.log.error('SparkController.create', err)
      this.status = 400
    }
  }
}
