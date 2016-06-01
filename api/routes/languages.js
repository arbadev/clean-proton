'use strict'

import Router from 'koa-router'

const router = new Router({ prefix: '/languages' })
const { LanguageController } = proton.app.controllers

router.get('/', LanguageController.find)

module.exports = router
