'use strict'

import Controller from 'proton-controller'

export default class FeedbackController extends Controller {
  // test
  * create() {
    try {
      const from = this.request.user._id
      const { title } = this.request.body
      const { description } = this.request.body
      const content = {
        reason: this.title,
        description: this.description,
        from: this.from,
      }
      const { EmailService } = proton.app.services
      const subject = 'FEEDBACK SPARKD'
      EmailService.sendMail(subject, content)
      yield Feedback.create({ from, title, description })
      this.response.status = 201
    } catch (err) {
      proton.log.error('FeedbackController.create', err)
      this.status = 400
    }
  }
}
