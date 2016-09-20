import Router from 'koa-router'

const router = new Router({ prefix: '/firebase-token' })
const { AuthPolicies } = proton.app.policies
const { FirebaseController } = proton.app.controllers

router.post('/', AuthPolicies.bearer, FirebaseController.createToken)

module.exports = router
