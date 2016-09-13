'use strict'
import Router from 'koa-router'

const router = new Router({ prefix: '/sparkds' })
const { AuthPolicies, AskPolicies } = proton.app.policies
const { SparkdController } = proton.app.controllers

router.get('/', AuthPolicies.bearer, SparkdController.find)
router.get('/:sparkd', AuthPolicies.bearer, SparkdController.findOne)

router.post(
  '/:sparkd/questions',
  AuthPolicies.bearer,
  AskPolicies.cansAsk,
  SparkdController.addQuestion
)
router.post(
  '/:sparkd/answers',
  AuthPolicies.bearer,
  AskPolicies.canReply,
  SparkdController.addAnswer
)

module.exports = router
