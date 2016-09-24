import Router from 'koa-router'
const router = new Router()
router.get('/', function * () {
  this.body = 'Welcome to persona app'
})


router.post('/test-level-2', function * () {
  const andres = yield User.findOne({ email: 'cjose.m@hotmail.com' })
  const marian = yield User.findOne({ email: 'msalcedo047@gmail.com' })
  const mToA = {
    value: 'like',
    from: marian._id,
    to: andres._id,
  }
  const aToM = {
    value: 'like',
    from: andres._id,
    to: marian._id,
  }

  // create sparkd
  yield Like.create(mToA)
  yield Like.create(aToM)

    // update to level 2
  yield Like.create(mToA)
  yield Like.create(aToM)

  this.response.body = 'Test created'
})

module.exports = router
