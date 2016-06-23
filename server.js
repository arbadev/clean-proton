'use strict'

require('babel-polyfill')
require('babel-core/register')

const Proton = require('proton-koa')
const api = require('./api')
const app = new Proton(api)

if (app.env === 'development') {
  console.log('================= Server in development mode =================\n')
  require('dotenv').config()
}

app.use(function * (next) {
  const requestInfo = `${this.request.method} ${this.request.url}`
  console.log(`\n\n\n ${requestInfo} ===========================`)
  yield next
})

module.exports = app.start()
