'use strict'
import Router from 'koa-router'

const router = new Router({ prefix: '/users' })
const { AuthPolicies } = proton.app.policies
const {
  UserController,
  ReportController,
  FeedbackController,
  ThirdPartyController,
} = proton.app.controllers

router.get('/', AuthPolicies.bearer, UserController.find)
router.post('/', AuthPolicies.bearerWithoutUser, UserController.create)

router.put('/me', AuthPolicies.bearer, UserController.updateMe)

router.get('/me', AuthPolicies.bearer, UserController.findMe)
router.patch('/me', AuthPolicies.bearer, UserController.updateMe)
router.post('/me/firebase-token', AuthPolicies.bearer, ThirdPartyController.createFirebaseToken)

router.delete('/:userId', UserController.destroy)

router.post('/:id/like', AuthPolicies.bearer, UserController.like)

router.post('/:id/dislike', AuthPolicies.bearer, UserController.dislike)

/*   users reports  */
router.post('/:userId/report', AuthPolicies.bearer, ReportController.create)

/*   users feedbacks  */
router.post('/feedback', AuthPolicies.bearer, FeedbackController.create)

/*    test EmailService   */
router.post('/mail', ReportController.emailTest)

module.exports = router
