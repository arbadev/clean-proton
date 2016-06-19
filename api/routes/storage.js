'use strict'

import Router from 'koa-router'

const router = new Router({ prefix: '/cloudinary-signatures' })
const {StorageController} = proton.app.controllers

router.post('/', StorageController.createCloudinarySignature)

module.exports = router
