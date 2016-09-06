'use strict'

import Controller from 'proton-controller'

export default class FeedbackController extends Controller {
  // test
  * create() {
    try {
      const from = this.request.user._id
      const { tittle } = this.request.body
      const { description } = this.request.body
      yield Feedback.create({ from, tittle, description })
      this.response.status = 201
    } catch (err) {
      proton.log.error('FeedbackController.create', err)
      this.status = 400
    }
  }
}
