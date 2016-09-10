/* eslint max-len: 0 */
import supertest from 'co-supertest'
import app from '../../server.js'

// Declarative section
const request = supertest(app)

describe('StorageController', () => {
  it('create cloudinary signature object', function*() {
    const response = yield request
      .post('/cloudinary-signatures')
      .expect(201)
    proton.log.debug('signature', response.body)
  })

  it('create bucket object', function*() {
    const response = yield request
      .post('/s3-signed-uris')
      .expect(201)
    proton.log.debug('Bucket object', response.body)
  })
})
