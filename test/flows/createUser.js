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
    const resAuth = yield request
      .post('/auth')
      .send({ access_token: facebookToken })
      .expect(200)
    proton.log.debug('Auth response', resAuth.body)

    const resUser = yield request
      .post('/users')
      .set('Authorization', `Bearer ${resAuth.body.token}`)
      .send(user)
      .expect(201)
    proton.log.debug('Create user', resUser.body)

    const resAvatar = yield request
      .put('/users/me/avatar')
      .attach('avatar', 'test/fixtures/avatar-tony.png')
      .set('Authorization', `Bearer ${resAuth.body.token}`)
      .expect(200)
    proton.log.debug('Update avatar', resAvatar.body)

    const resMessage = yield request
       .put('/users/me/message')
       .attach('message', 'test/fixtures/avatar-tony.png')
       .set('Authorization', `Bearer ${resAuth.body.token}`)
       .expect(200)
    proton.log.debug('Update message', resMessage.body)

    const resGetUser = yield request
      .get('/users?gender=man')
      .set('Authorization', `Bearer ${resAuth.body.token}`)
      .expect(200)
    proton.log.debug('List users', resGetUser.body)

    const resDel = yield request
       .delete(`/users/${user.facebookId}`)
       .expect(200)
    proton.log.debug('Delete user', resDel.body)
  })
})
