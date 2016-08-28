'use strict'
import Router from 'koa-router'

const router = new Router({ prefix: '/users' })
const { AuthPolicies } = proton.app.policies
const { UserController, ReportController } = proton.app.controllers

router.get('/', AuthPolicies.bearer, UserController.find)
router.post('/', AuthPolicies.bearerWithoutUser, UserController.create)
router.get('/me', AuthPolicies.bearer, UserController.findMe)
router.patch('/me', AuthPolicies.bearer, UserController.updateMe)
//router.put('/me/avatar', AuthPolicies.bearer, UserController.uploadAvatar)
//router.put('/me/message', AuthPolicies.bearer, UserController.uploadMessage)
router.get('/:userId', AuthPolicies.bearerWithoutUser, UserController.findOne)
router.delete('/:userId', UserController.destroy)

/*   /users/me/sparkds  */
router.get('/me/sparkds', AuthPolicies.bearer, UserController.findSparkds)
//router.get('/me/sparkds/:sparkdId', AuthPolicies.bearer, UserController.findSparkd)
//router.patch('/me/sparkds/:sparkdId', AuthPolicies.bearer, UserController.updateSparkd)

router.post('/:id/like', AuthPolicies.bearer, UserController.like)

/*   users reports  */
router.post('/:userId/reports', AuthPolicies.bearer, ReportController.create)

module.exports = router
