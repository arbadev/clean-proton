import supertest from 'co-supertest'
import app from '../../server.js'

const request = supertest(app)

describe('UserController', () => {

  let [barbara, luis] = ['', '']

  const users = [
    {
      firstName: 'Barbarita',
      email: 'baba@gmail.com',
      facebookId: 1
    },
    {
      firstName: 'luis',
      email: 'luis@nucleos.io',
      facebookId: 2
    }
  ]

  before(function*() {
    [barbara, luis] = yield User.create(users)
    barbara.token = yield Token.generate(barbara._id)
    luis.token = yield Token.generate(luis._id)
  })

  after(function*() {
    yield [User.remove({}), Token.remove({})]
  })

  it('Barbara likes Luis', function*(){
    yield request
      .post(`/users/${luis._id}/like`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(201)
  })

  it('Luis not like Barbara', function*() {
    yield request
      .post(`/users/${barbara._id}/dislike`)
      .set('Authorization', `Bearer ${luis.token.value}`)
      .expect(201)
  })

  it('Trying to update a profile', function*() {
    const { body } = yield request
      .put(`/users/me/`)
      .set('Authorization', `Bearer ${luis.token.value}`)
      .send({firstName: 'Mechas'})
      .expect(200)

    console.log(body)
  })


})
