import supertest from 'co-supertest'
import app from '../../server.js'
import { expect } from 'chai'

const request = supertest(app)

describe('SparkController', () => {
  let [barbara, luis, spark] = ['', '', '']

  const users = [
    {
      firstName: 'Barbarita',
      email: 'baba@gmail.com',
      facebookId: 1,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
    {
      firstName: 'luis',
      email: 'luis@nucleos.io',
      facebookId: 2,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
  ]

  before(function*() {
    [barbara, luis] = yield User.create(users)
    spark = yield Sparkd.create({ users: [barbara, luis] })
    barbara.token = yield Token.generate(barbara.facebookId)
    luis.token = yield Token.generate(luis.facebookId)
  })

  after(function*() {
    yield [User.remove({}), Token.remove({})]
  })

  it('Add message to a spark', function*() {
    const message = 'hola'
    const { body } = yield request
      .post(`/sparkds/${spark._id}/messages`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .send({ message })
      .expect(201)
    const user = body.users.find(element => element._id = barbara._id)
    expect(user).to.have.property('message', message)
  })

  it('Find sparkds', function*() {
    const { body } = yield request
      .get('/sparkds')
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(200)
    proton.log.debug('body', body)
  })
})
