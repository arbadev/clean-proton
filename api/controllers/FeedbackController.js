'use strict'

import Controller from 'proton-controller'

export default class FeedbackController extends Controller {
  // test
  * create() {
    try {
      proton.log.debug('FeedbackController.create')
      const from = this.request.user._id
      const { title } = this.request.body
      const { description } = this.request.body
      const content = { title, description, from }
      const { EmailService } = proton.app.services
      const subject = 'FEEDBACK SPARKD'
      EmailService.sendMail(subject, content)
      proton.log.debug('After mail')
      yield Feedback.create({ from, title, description })
      proton.log.debug('After Create Feedback')
      this.response.status = 201
    } catch (err) {
      proton.log.error('FeedbackController.create', err)
      this.status = 400
    }
  }
}
