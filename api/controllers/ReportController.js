'use strict'

import Controller from 'proton-controller'

export default class ReportController extends Controller {
  // test
  * create() {
    try {
      proton.log.debug('ReportController.create')
      const from = this.request.user._id
      const to = this.params.userId
      const subject = 'REPORT SPARKD'
      const { reason } = this.request.body
      const { description } = this.request.body
      const content = {
        reason: this.reason,
        description: this.description,
        from: this.from,
        to: this.to,
      }
      const { EmailService } = proton.app.services
      EmailService.sendMail(subject, content)
      proton.log.debug('After mail')
      yield Report.create({ from, to, reason, description })
      proton.log.debug('After Create report')
      this.response.status = 201
    } catch (err) {
      proton.log.error('ReportController.create', err)
      this.status = 400
    }
  }

  * emailTest() {
    try {
      const { EmailService } = proton.app.services
      const subject = 'REPORT MAIL'
      const content = {
        reason: 'A reason 2.0',
        description: 'A description 2.0',
      }
      EmailService.sendMail(subject, content)
      this.response.status = 201
    } catch (err) {
      proton.log.error('ReportController.createMail', err)
      this.status = 400
    }
  }

}
