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
      const description = 'a description'
      const reason = 'a tittle'
      EmailService.sendReportMail(reason, description)
      this.response.status = 201
    } catch (err) {
      proton.log.error('ReportController.createMail', err)
      this.status = 400
    }
  }

}
