'use strict'

import Controller from 'proton-controller'

export default class SparkdController extends Controller {

  /**
   *
   */
  * find() {
    try {
      this.status = 200
    } catch (err) {
      proton.log.error('SparkdController.find', err)
      this.status = 400
    }
  }
}
