import Router from 'koa-router'

const router = new Router({ prefix: '/layer-sessions' })
const { AuthPolicies } = proton.app.policies
const { LayerController } = proton.app.controllers

router.post('/', AuthPolicies.bearer, LayerController.getSession)

module.exports = router
