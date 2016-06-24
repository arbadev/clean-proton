/* eslint max-len: 0 */
'use strict'

import supertest from 'co-supertest'
import app from '../../server.js'

// Declarative section
const request = supertest(app)
const facebookToken = 'CAAIjRkSocuoBAI2nsD9aIRrGX7aOiNByXjJTbmlKi011wldd4IsjtVwYWQ84Fak55qOzmX2UhDwJoHznNs3Ck0cLTMZAqaheagVAQUsm9q07DZCO7ZAPXmJ6H6nGA6ryZAAZC8ZAA7Q0Hu4YEuqEeQ9Ou20DzQYi5yvKvpDwIc3utAsN35IdRZAcMdhSjuTGFyUlZChin5l4yi7o2HJmGZB3celXb2F40mDg3wSoFtFkpJgZDZD'
const user = {
  firstName: 'Carlos',
  lastName: 'Marcano',
  email: 'cj@nucleos.io',
  avatar: 'avatar.png',
  message: 'message.png',
  facebookId: '10208334708303023',
}

describe('All flow for create a user', () => {
  it('createUser', function*() {
    let response = {}
    const printResponse = tag => proton.log.debug(tag, response.body)

    response = yield request
      .post('/auth')
      .send({ access_token: facebookToken })
      .expect(200)
    const { token } = response.body
    printResponse('POST /auth')

    response = yield request
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(201)
    printResponse('POST /users')

    const languages = (yield Language.find().limit(5)).map(lang => lang._id)
    response = yield request
      .put('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ languages })
      .expect(200)
    printResponse('PUT /users/me (update languages)')

    response = yield request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    printResponse('GET /users')

    response = yield request
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    printResponse('GET /users/me')

    response = yield request
      .post('/auth')
      .send({ access_token: facebookToken })
      .expect(200)
    printResponse('POST /auth (after create user)')

    response = yield request
       .delete(`/users/${user.facebookId}`)
       .expect(200)
    printResponse('DELETE /users/:id')
  })
})
