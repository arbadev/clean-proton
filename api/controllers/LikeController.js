'use strict'

import Controller from 'proton-controller'

export default class LikeController extends Controller {

  /**
   *
   *
   */
  * create() {
    try {
      const from = this.request.user._id
      const like = yield Like.create(Object.assign({}, this.request.body, { from }))
      this.response.body = like
      this.status = 201
    } catch (err) {
      proton.log.error('SparkController.create', err)
      this.status = 400
    }
  }
}
