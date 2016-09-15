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
      const criteria = { 'users._id': from }
      const userReporter = yield User.findOneById(criteria)
      const userName = `${userReporter.firstName} ${userReporter.lastName}`
      const userEmail = userReporter.email
      const content = { reason, from, to, userName, userEmail }
      const { EmailService } = proton.app.services
      EmailService.sendReportMail(subject, content)
      proton.log.debug('After mail')
      yield Report.create({ from, to, reason })
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
        reason: 'Photo',
        userName: 'Andres Barradas',
        userEmail: 'a3barradas@gmial.com',
        from: 'asd32k23j242l',
        to: 'skjdnaskdnl2324234',
      }
      EmailService.sendReportMail(subject, content)
      this.response.status = 201
    } catch (err) {
      proton.log.error('ReportController.createMail', err)
      this.status = 400
    }
  }

}
