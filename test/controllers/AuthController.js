/* eslint max-len: 0 */
import supertest from 'co-supertest'
import app from '../../server.js'

// Declarative section
const request = supertest(app)
const facebookToken = 'EAAIjRkSocuoBAFOIknNBV9aZC9Y5QZAVjoDwFOlFdbHB6iZBKgdS2L4AZCp0Nj2CQYougj3XF1NVJKXZAmNtzrFdvZAiFZC75UfK9l0fbj3IA7hFo2ME3rr3ZBPuJEX4oxsmCznQRO7TG4VrVEGgwfgMT38SP9Rl1px0hO2KAuNCXKJZCP24HKrSaZAyZCfOkBuZAxFQvRf05873YQIwOMqEj4UW'

describe('AuthController', () => {
  it('authenticate', function*() {
    yield request
      .post('/auth')
      .send({ access_token: facebookToken })
      .expect(200)
  })
})
