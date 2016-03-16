import supertest from 'co-supertest'
import app from '../../server.js'

const request = supertest(app)

describe('UserController', () => {

  it('create', function*() {
    const user = {
      firstName: 'Carlos',
      lastName: 'Marcano',
      email: 'cj@nucleos.io',
      avatar: 'avatar.png',
      message: 'message.png',
      facebookId: '123456789'
    }
    const response = yield request
      .post('/users')
      .send(user)
      .set('Authorization', 'Bearer xxxx')
      .expect(401)
  })
  //
  // it('uploadAvatar', function*() {
  //   const response = yield request
  //     .put('/users/me/avatar')
  //     .attach('avatar', 'test/fixtures/avatar-tony.png')
  //     .expect(200)
  //     proton.log.debug('PUT /users/me/avatar', response.body)
  // })
  //
  // it('uploadMessage', function*() {
  //   const response = yield request
  //     .put('/users/me/message')
  //     .set('Authorization', 'Bearer 12345678987456321')
  //     .attach('message', 'test/fixtures/message.mp3')
  //     .expect(200)
  //     proton.log.debug('PUT /users/me/message', response.body)
  // })
  //
  // it('find', function*() {
  //   const response = yield request
  //     .get(`/users`)
  //     .set('Content-Type', 'application/json')
  //     .expect(200)
  //     proton.log.debug('GET /users', response.body)
  // })
  //
  // it('findOne', function*() {
  //   const id = 'cj@nucleos.io'
  //   const response = yield request
  //     .get(`/users/${id}`)
  //     .set('Content-Type', 'application/json')
  //     .send({apikey})
  //     .expect(200)
  //     proton.log.debug('GET /users/:id', response.body)
  // })
})
