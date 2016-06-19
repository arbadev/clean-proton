/* eslint max-len: 0 */
import supertest from 'co-supertest'
import should from 'should'
import app from '../../server.js'

// Declarative section
const request = supertest(app)

describe('StorageController', () => {
  it('create signature object', function*() {
    const response = yield request
      .post('/cloudinary-signatures')
      .expect(201)
  })
})
