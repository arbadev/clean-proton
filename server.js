'use strict'

require('babel-polyfill')
require('babel-core/register')

const Proton = require('proton-koa')
const api = require('./api')
const app = new Proton(api)

module.exports = app.start()
