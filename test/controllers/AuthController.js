'use strict'

import supertest from 'co-supertest'
import app from '../../server.js'

// Declarative section
const request = supertest(app)
const facebookToken = 'CAAIjRkSocuoBAI2nsD9aIRrGX7aOiNByXjJTbmlKi011wldd4IsjtVwYWQ84Fak55qOzmX2UhDwJoHznNs3Ck0cLTMZAqaheagVAQUsm9q07DZCO7ZAPXmJ6H6nGA6ryZAAZC8ZAA7Q0Hu4YEuqEeQ9Ou20DzQYi5yvKvpDwIc3utAsN35IdRZAcMdhSjuTGFyUlZChin5l4yi7o2HJmGZB3celXb2F40mDg3wSoFtFkpJgZDZD'


describe('AuthController', () => {

  it('authenticate', function*() {
    const response = yield request
      .post('/auth')
      .send({access_token: facebookToken})
      .expect(200)
  })

})
