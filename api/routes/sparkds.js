'use strict'
import Router from 'koa-router'

const router = new Router({ prefix: '/sparkds' })
const { AuthPolicies } = proton.app.policies
const { SparkdController } = proton.app.controllers

router.get('/', AuthPolicies.bearer, SparkdController.find)
router.post('/:spark/messages', AuthPolicies.bearer, SparkdController.addMessage)

module.exports = router
