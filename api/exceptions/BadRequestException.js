'use strict'

let Exception = require('proton-exception')

module.exports = class BadRequestException extends Exception {
  constructor(message) {
    super(message)
  }

  handle(ctx) {
    ctc.status = 400
  }


}
