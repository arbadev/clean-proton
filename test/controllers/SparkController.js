import supertest from 'co-supertest'
import app from '../../server.js'
import { expect } from 'chai'

const request = supertest(app)

describe('SparkController', () => {
  let { barbara, luis, carlos, marian, alex, andres, spark } = {}

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
    {
      firstName: 'Carlos',
      email: 'carlos@nucleos.io',
      facebookId: 3,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
    {
      firstName: 'Marian',
      email: 'marian@nucleos.io',
      facebookId: 4,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
    {
      firstName: 'Alexander',
      email: 'alex@nucleos.io',
      facebookId: 5,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
    {
      firstName: 'Andres',
      email: 'andres@nucleos.io',
      facebookId: 6,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
  ]

  before(function*() {
    [barbara, luis, carlos, marian, alex, andres] = yield User.create(users)
    spark = yield Sparkd.create({ users: [barbara, luis] })

    yield Sparkd.create([
      { users: [barbara, carlos] },
      { users: [barbara, marian] },
      { users: [barbara, alex] },
      { users: [barbara, andres] },
    ])

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
    const { body, headers } = yield request
      .get('/sparkds?level=1&status=sparking')
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(200)
    proton.log.debug('headers', headers)
    proton.log.debug('body', body)
  })
})
