/* eslint no-undef: 0 */

import supertest from 'co-supertest'
import app from '../../server.js'
import { expect } from 'chai'

const request = supertest(app)

describe('LayerController', () => {
  let barbara = ''

  const users = [
    {
      firstName: 'Barbarita',
      email: 'baba@gmail.com',
      facebookId: 1,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
    },
  ]

  beforeEach(function*() {
    [barbara] = yield User.create(users)
    barbara.token = yield Token.generate(barbara.facebookId)
  })

  afterEach(function*() {
    yield [User.remove({}), Token.remove({})]
  })

  it('get session token', function*() {
    const nonce = 'l3TsSFTSMILmX2ONrqYqKSJrUzyitC57dGALE_ExA0RO03QyaFVduISWDYvq9BLZdGnwHzLVF4wZOLF'
    const { body } = yield request
      .post('/layer-sessions')
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .send({ nonce })
      .expect(200)
    expect(body).to.have.property('identityToken')
  })
})
