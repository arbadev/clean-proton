'use strict'

import supertest from 'co-supertest'
import app from '../../server.js'

// Declarative section
const request = supertest(app)
const facebookToken = 'CAAIjRkSocuoBAMTvlOtxfHccCnCaxsbpeZCI5OH69xu4eDYIbzNc4As3hpsoX2ZBkFq0XWfNdvVEnqW2RlJbpp6f83rUwnB48AZCIPcQai3493b2vPt7oUTZAZAesveQnbcLd9xmlj92s8hmCIdfd7OwC7p3txW2ZBVZCFVS2TbV3QpzWu2mK6fbFGt1tzqKjsG6XSQspGR3QSZCzSUZB7c1JIHGeZCu5UqC4YhTmWNSMlyAZDZD'


describe('AuthController', () => {

  it('authenticate', function*() {
    const response = yield request
      .post('/auth')
      .send({access_token: facebookToken})
      .expect(200)
  })

})
