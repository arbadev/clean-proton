'use strict'

import Router from 'koa-router'

const router = new Router({ prefix: '/cloudinary-signatures' })
const {CloudinaryController} = proton.app.controllers

router.get('/', CloudinaryController.getSignature)

module.exports = router
