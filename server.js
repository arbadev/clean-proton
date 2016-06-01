'use strict'

require("babel-polyfill")
require('babel-core/register')

var Proton = require('proton-koa')
var multer = require('koa-multer')
var app = new Proton(require('./api'))

app.use(function * (next) {
  const requestInfo = `${this.request.method} ${this.request.url}`
  console.log(`\n\n\n ${requestInfo} ===========================`)
  yield next
})

module.exports =  app.start()
