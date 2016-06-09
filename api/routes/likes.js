'use strict'
import Router from 'koa-router'

const router = new Router({ prefix: '/likes' })
const { AuthPolicies } = proton.app.policies
const { LikeController } = proton.app.controllers

router.post('/', AuthPolicies.bearer, LikeController.create)

module.exports = router
