'use strict'

import Router from 'koa-router'

const router = new Router()
const {StorageController} = proton.app.controllers

router.post('/cloudinary-signatures', StorageController.generateCloudinarySignature)

router.post('/s3-signed-uris', StorageController.generateBucketSignedUri)


module.exports = router
