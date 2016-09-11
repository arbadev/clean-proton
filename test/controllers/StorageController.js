/* eslint max-len: 0 */
import supertest from 'co-supertest'
import should from 'should'
import app from '../../server.js'

// Declarative section
const request = supertest(app)

describe.skip('StorageController', () => {

  it('create cloudinary signature object', function*() {
    const response = yield request
      .post('/cloudinary-signatures')
      .expect(201)
  })

  it('create bucket object', function*() {
    const response = yield request
      .post('/s3-signed-uris')
      .expect(201)
  })
})
