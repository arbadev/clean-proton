/* eslint no-undef: 0 */

import supertest from 'co-supertest'
import app from '../../server.js'
import { expect } from 'chai'

const request = supertest(app)

describe('UserController', () => {
  let [barbara, luis] = [{}, {}]

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
      message: 'message.mp3',
    },
  ]

  before(function*() {
    [barbara, luis] = yield User.create(users)
    barbara.token = yield Token.generate(barbara.facebookId)
    luis.token = yield Token.generate(luis.facebookId)
  })

  after(function*() {
    yield [User.remove({}), Token.remove({})]
  })

  it('Find', function*() {
    const y = yield request
      .get('/users')
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(200)

    proton.log.debug('users', y.body)
  })

  it('Barbara likes Luis', function*() {
    yield request
      .post(`/users/${luis._id}/like`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(201)
  })

  it('Luis not like Barbara', function*() {
    yield request
      .post(`/users/${barbara._id}/dislike`)
      .set('Authorization', `Bearer ${luis.token.value}`)
      .expect(201)
  })

  it('Update a user profile', function*() {
    yield request
      .put('/users/me')
      .set('Authorization', `Bearer ${luis.token.value}`)
      .send({ firstName: 'Mechas' })
      .expect(200)
  })

  it('Find me', function*() {
    const { body } = yield request
      .get('/users/me')
      .set('Authorization', `Bearer ${luis.token.value}`)
      .expect(200)
    proton.log.debug('body', body)
    expect(body).to.have.property('firstName')
    expect(body).to.have.property('email')
    expect(body).to.have.property('facebookId')
    expect(body).to.have.property('status')
    expect(body).to.have.property('avatar')
    expect(body).to.have.property('publicAvatar')
    expect(body).to.have.property('languages').an('array')
  })
})
