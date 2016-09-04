import supertest from 'co-supertest'
import app from '../../server.js'
import { expect } from 'chai'

const request = supertest(app)

describe('SparkController', () => {

  let [barbara, luis, spark] = ['', '', '']

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
    spark = yield Spark.create({ users: [barbara, luis] })
    barbara.token = yield Token.generate(barbara._id)
    luis.token = yield Token.generate(luis._id)
  })

  after(function*() {
    yield [User.remove({}), Token.remove({})]
  })

  it('Add message to a spark', function*(){
    const message = 'hola'
    const { body } = yield request
      .post(`/sparkds/${spark._id}/messages`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .send({ message })
      .expect(201)
    const user = body.users.find(element => element._id = barbara._id)
    expect(user).to.have.property('message', message)
  })

})
