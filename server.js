'use strict'

require("babel-polyfill")
require('babel-core/register')

var Proton = require('proton-koa')
var multer = require('koa-multer')
var app = new Proton(require('./api'))

module.exports =  app.start()
