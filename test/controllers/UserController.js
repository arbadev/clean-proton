/* eslint no-undef: 0 */

import supertest from 'co-supertest'
import app from '../../server.js'
import { expect } from 'chai'

const request = supertest(app)

describe('UserController', () => {
  let [barbara, luis, mariangela, andres] = []

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
      firstName: 'Mariangela',
      email: 'marian@nucleos.io',
      facebookId: 3,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
    {
      firstName: 'andres',
      email: 'andres@nucleos.io',
      facebookId: 4,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
  ]

  beforeEach(function*() {
    [barbara, luis, mariangela, andres] = yield User.create(users)
    barbara.token = yield Token.generate(barbara.facebookId)
    luis.token = yield Token.generate(luis.facebookId)
    mariangela.token = yield Token.generate(mariangela.facebookId)
    andres.token = yield Token.generate(andres.facebookId)
  })

  afterEach(function*() {
    yield [User.remove({}), Token.remove({})]
  })

  it('Find', function*() {
    const { body } = yield request
      .get('/users')
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(200)
    proton.log.debug('users', body)
  })

  it('Barbara likes Luis', function*() {
    yield request
      .post(`/users/${luis._id}/like`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(201)
  })

  it('Andres likes Mariangela', function*() {
    yield request
      .post(`/users/${mariangela._id}/like`)
      .set('Authorization', `Bearer ${andres.token.value}`)
      .expect(201)
  })

  it('Mariangela likes Andres', function*() {
    yield request
      .post(`/users/${andres._id}/like`)
      .set('Authorization', `Bearer ${mariangela.token.value}`)
      .expect(201)
  })

  it('Luis likes Barbara', function*() {
    yield request
      .post(`/users/${barbara._id}/like`)
      .set('Authorization', `Bearer ${luis.token.value}`)
      .expect(201)
  })

  it('Barbara still likes luis', function*() {
    yield request
      .post(`/users/${luis._id}/like`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(201)
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

  it('Mariangela still likes Andres', function*() {
    yield request
      .post(`/users/${andres._id}/like`)
      .set('Authorization', `Bearer ${mariangela.token.value}`)
      .expect(201)
  })

  it('Andres still likes Mariangela', function*() {
    yield request
      .post(`/users/${mariangela._id}/like`)
      .set('Authorization', `Bearer ${andres.token.value}`)
      .expect(201)
  })

  it('Find me', function*() {
    const { body } = yield request
      .get('/users/me')
      .set('Authorization', `Bearer ${luis.token.value}`)
      .expect(200)
    expect(body).to.have.property('firstName')
    expect(body).to.have.property('email')
    expect(body).to.have.property('facebookId')
    expect(body).to.have.property('status')
    expect(body).to.have.property('avatar')
    expect(body).to.have.property('publicAvatar')
    expect(body).to.have.property('languages').an('array')
  })

  describe.skip('reports on sparks', () => {
    const aReason = 'Photo'
    const aDescription = 'a description'

    it('Mariangela report Andres', function*() {
      yield request
      .post(`/users/${andres._id}/report`)
      .set('Authorization', `Bearer ${mariangela.token.value}`)
      .send({ reason: aReason, description: aDescription })
      .expect(201)
    })
    it('Andres report Mariangela', function*() {
      yield request
      .post(`/users/${mariangela._id}/report`)
      .set('Authorization', `Bearer ${andres.token.value}`)
      .send({ reason: aReason, description: aDescription })
      .expect(201)
    })
  })

  describe.skip('Sparkd Feedbacks', () => {
    const aTitle = 'My title'
    const aDescription = 'a description'

    it('Mariangela sends Feedbacks', function*() {
      yield request
      .post('/users/feedback')
      .set('Authorization', `Bearer ${mariangela.token.value}`)
      .send({ title: aTitle, description: aDescription })
      .expect(201)
    })
    it('Andres sends Feedbacks', function*() {
      yield request
      .post('/users/feedback')
      .set('Authorization', `Bearer ${andres.token.value}`)
      .send({ title: aTitle, description: aDescription })
      .expect(201)
    })
  })
})
