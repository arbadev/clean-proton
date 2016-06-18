/* eslint max-len: 0 */
import supertest from 'co-supertest'
import should from 'should'
import app from '../../server.js'

// Declarative section
const request = supertest(app)

describe('CloudinaryController', () => {
  it('generate signature object', function*() {
    const response = yield request
      .get('/cloudinary-signatures')
      .expect(200)
    proton.log.debug('Cloudinary sha1 response', response.body)
    response.body.should.have.property('signature')
    response.body.should.have.property('uri')
    response.body.should.have.property('id')
    response.body.should.have.property('time')
  })
})
