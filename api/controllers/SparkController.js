'use strict'

import Controller from 'proton-controller'

export default class SparkController extends Controller {

  * create() {
    proton.log.debug('create spark : ', this.request.body)
    try {
      this.body = Spark.create(this.request.body)
      this.status = 201

    } catch (err) {
      proton.log.error('SparkController.create', err)
      this.status = 400
    }
  }

}
