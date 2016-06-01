'use strict'

import Controller from 'proton-controller'

export default class LanguageController extends Controller {

  * find() {
    try {
      this.response.body = yield Language.find()
    } catch (err) {
      proton.log.error('LanguageController.find', err)
      this.response.status = 400
    }
  }

}
