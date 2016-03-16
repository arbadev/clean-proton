'use strict'

import supertest from 'co-supertest'
import app from '../../server.js'

// Declarative section
const request = supertest(app)
const facebookToken = 'CAAIjRkSocuoBAMTvlOtxfHccCnCaxsbpeZCI5OH69xu4eDYIbzNc4As3hpsoX2ZBkFq0XWfNdvVEnqW2RlJbpp6f83rUwnB48AZCIPcQai3493b2vPt7oUTZAZAesveQnbcLd9xmlj92s8hmCIdfd7OwC7p3txW2ZBVZCFVS2TbV3QpzWu2mK6fbFGt1tzqKjsG6XSQspGR3QSZCzSUZB7c1JIHGeZCu5UqC4YhTmWNSMlyAZDZD'
const user = {
  firstName: 'Carlos',
  lastName: 'Marcano',
  email: 'cj@nucleos.io',
  avatar: 'avatar.png',
  message: 'message.png',
  facebookId: '10208334708303023'
}

describe('All flow for create a user', () => {

  it('Create a user in Persona', function*() {
    const resAuth = yield request
      .post('/auth')
      .send({access_token: facebookToken})
      .expect(200)
    proton.log.debug('Auth response', resAuth.body)

    const resUser = yield request
      .post('/users')
      .set('Authorization', `Bearer ${resAuth.body.token}`)
      .send(user)
      .expect(201)
    proton.log.debug('User response', resUser.body)

    const resAvatar = yield request
      .put('/users/me/avatar')
      .attach('avatar', 'test/fixtures/avatar-tony.png')
      .set('Authorization', `Bearer ${resAuth.body.token}`)
      .expect(200)
    proton.log.debug('Avatar response', resAvatar.body)

    const resMessage = yield request
       .put('/users/me/message')
       .attach('message', 'test/fixtures/avatar-tony.png')
       .set('Authorization', `Bearer ${resAuth.body.token}`)
       .expect(200)
      proton.log.debug('Message response', resMessage.body)

    const resDel = yield request
       .delete('/users/' + user.facebookId)
       .expect(200)
      proton.log.debug('Delete user response', resDel.body)
  })

})
