'use strict'
import Router from 'koa-router'

const router = new Router({ prefix: '/sparkds' })
const { AuthPolicies, AskPolicies } = proton.app.policies
const { SparkdController } = proton.app.controllers

router.get('/', AuthPolicies.bearer, SparkdController.find)

router.post(
  '/:spark/questions',
  AuthPolicies.bearer,
  AskPolicies.cansAsk,
  SparkdController.addQuestion
)
router.post(
  '/:spark/answers',
  AuthPolicies.bearer,
  AskPolicies.canReply,
  SparkdController.addAnswer
)

module.exports = router
