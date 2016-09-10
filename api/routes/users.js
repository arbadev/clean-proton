'use strict'
import Router from 'koa-router'

const router = new Router({ prefix: '/users' })
const { AuthPolicies } = proton.app.policies
const { UserController, ReportController } = proton.app.controllers

router.get('/', AuthPolicies.bearer, UserController.find)
router.post('/', AuthPolicies.bearerWithoutUser, UserController.create)

router.put('/me', AuthPolicies.bearer, UserController.updateMe)

router.get('/me', AuthPolicies.bearer, UserController.findMe)
router.patch('/me', AuthPolicies.bearer, UserController.updateMe)
router.delete('/:userId', UserController.destroy)

router.post('/:id/like', AuthPolicies.bearer, UserController.like)

router.post('/:id/dislike', AuthPolicies.bearer, UserController.dislike)

/*   users reports  */
router.post('/:userId/reports', AuthPolicies.bearer, ReportController.create)

module.exports = router
