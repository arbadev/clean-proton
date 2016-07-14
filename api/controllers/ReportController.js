'use strict'

import Controller from 'proton-controller'

export default class ReportController extends Controller {

  * create() {
    try {
      this.response.status = 204
    } catch (err) {
      proton.log.error('ReportController.create', err)
      this.status = 400
    }
  }

}
