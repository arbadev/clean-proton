'use strict'

import Controller from 'proton-controller'

export default class ReportController extends Controller {

  * create() {
    try {
      const from = this.request.user._id
      const to = this.params.userId
      const { reason } = this.request.body
      const { description } = this.request.body
      yield Report.create({ from, to, reason, description })
      this.response.status = 204
    } catch (err) {
      proton.log.error('ReportController.create', err)
      this.status = 400
    }
  }

}
