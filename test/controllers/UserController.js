import supertest from 'co-supertest'
import app from '../../server.js'

const request = supertest(app)

describe('UserController', () => {

  describe('Likes and Sparks', () => {

    let [barbara, luis, mariangela, andres] = ['', '', '', '']

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
      },
      {
        firstName: 'Mariangela',
        email: 'marian@nucleos.io',
        facebookId: 3
      },
      {
        firstName: 'andres',
        email: 'andres@nucleos.io',
        facebookId: 4
      }
    ]

    before(function*() {
      [barbara, luis, mariangela, andres] = yield User.create(users)
      barbara.token = yield Token.generate(barbara._id)
      luis.token = yield Token.generate(luis._id)
      mariangela.token = yield Token.generate(mariangela._id)
      andres.token = yield Token.generate(andres._id)
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

    it('Andres likes Mariangela', function*() {
      yield request
        .post(`/users/${mariangela._id}/like`)
        .set('Authorization', `Bearer ${andres.token.value}`)
        .expect(201)
    })

    it('Mariangela likes Andres', function*(){
      yield request
        .post(`/users/${andres._id}/like`)
        .set('Authorization', `Bearer ${mariangela.token.value}`)
        .expect(201)
    })

    it('Luis likes Barbara', function*() {
      yield request
        .post(`/users/${barbara._id}/like`)
        .set('Authorization', `Bearer ${luis.token.value}`)
        .expect(201)
    })

    it('Barbara still likes luis', function*(){
      yield request
        .post(`/users/${luis._id}/like`)
        .set('Authorization', `Bearer ${barbara.token.value}`)
        .expect(201)
    })

    it('Luis still likes Barbara', function*() {
      yield request
        .post(`/users/${barbara._id}/like`)
        .set('Authorization', `Bearer ${luis.token.value}`)
        .expect(201)
    })

    it('Mariangela still likes Andres', function*(){
      yield request
        .post(`/users/${andres._id}/like`)
        .set('Authorization', `Bearer ${mariangela.token.value}`)
        .expect(201)
    })

    it('Andres still likes Mariangela', function*() {
      yield request
        .post(`/users/${mariangela._id}/like`)
        .set('Authorization', `Bearer ${andres.token.value}`)
        .expect(201)
    })

  })

})
