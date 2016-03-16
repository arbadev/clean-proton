'use strict'

let Exception = require('proton-exception')


class NotFoundException extends Exception {
  constructor(message) {
    super(message)
  }
}

module.exports = NotFoundException
