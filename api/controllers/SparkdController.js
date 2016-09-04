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

  * addMessage() {
    try {
      const from = this.request.user._id
      const { message } = this.request.body
      const spark = yield Spark.addMessage(this.params.spark, from, message)
      this.status = 201
      this.response.body = spark
    } catch (err) {
      const message = `An error ocurred adding the message to an spark`
      proton.log.error(message, err)
      this.status = 400
    }
  }


}
