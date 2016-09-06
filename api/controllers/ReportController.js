'use strict'

import Controller from 'proton-controller'

export default class ReportController extends Controller {
  // test
  * create() {
    try {
      const from = this.request.user._id
      const to = this.params.userId
      const { reason } = this.request.body
      const { description } = this.request.body
      const { EmailService } = proton.app.services
      EmailService.sendReportMail(reason, description)
      yield Report.create({ from, to, reason, description })
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
      EmailService.sendReportMail(subject, content)
      this.response.status = 201
    } catch (err) {
      proton.log.error('ReportController.createMail', err)
      this.status = 400
    }
  }

}
