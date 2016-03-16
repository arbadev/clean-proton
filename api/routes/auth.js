'use strict'
import Router from 'koa-router'

const router = new Router({
  prefix: '/auth'
})

router.post('/', AuthPolicies.facebook, AuthController.authenticate)

module.exports = router
