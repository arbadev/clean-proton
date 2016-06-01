'use strict'
import Router from 'koa-router'

const router = new Router({ prefix: '/users' })
const { AuthPolicies } = proton.app.policies
const { UserController } = proton.app.controllers

router.post('/', AuthPolicies.bearerWithoutUser, UserController.create)
router.del('/:id', UserController.destroy)
router.put('/me/avatar', AuthPolicies.bearer, UserController.uploadAvatar)
router.put('/me/message', AuthPolicies.bearer, UserController.uploadMessage)

module.exports = router
