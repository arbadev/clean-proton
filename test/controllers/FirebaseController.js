/* eslint no-undef: 0 */

import supertest from 'co-supertest'
import app from '../../server.js'

const request = supertest(app)

describe('FirebaseController', () => {
  let barbara = {}

  const users = [
    {
      firstName: 'Barbarita',
      email: 'baba@gmail.com',
      facebookId: 1,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
  ]

  before(function*() {
    [barbara] = yield User.create(users)
    barbara.token = yield Token.generate(barbara.facebookId)
  })

  after(function*() {
    yield [User.remove({}), Token.remove({})]
  })

  it('Create token', function*() {
    yield request
      .post('/firebase-token')
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(201)
  })
})
