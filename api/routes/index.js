import Router from 'koa-router'
const router = new Router()
router.get('/', function * () {
  this.body = 'Welcome to persona app'
})
