'use strict'
import Router from 'koa-router'

const router = new Router({ prefix: '/users' })
const {
  UserController
} = proton.app.controllers

// router.get('/', AuthPolicies.bearer, UserController.find)


module.exports = router
