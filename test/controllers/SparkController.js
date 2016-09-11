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

  it('Barbara add question to his spark with Luis', function*(){
    const question = 'hola'
    const { body } = yield request
      .post(`/sparkds/${spark._id}/questions`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .send({ question })
      .expect(201)
    const user = body.users.find(element => element._id == barbara._id)
    expect(user).to.have.property('question', question)
  })

  it('Barbara cant respond if not exist a question from Luis', function*(){
    const answer = 'hola'
    const { body } = yield request
      .post(`/sparkds/${spark._id}/answers`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .send({ answer })
      .expect(400)
  })

  it('Luis add an answer to the spark that he has with Barbara', function*(){
    const answer = 'hola'
    const { body } = yield request
      .post(`/sparkds/${spark._id}/answers`)
      .set('Authorization', `Bearer ${luis.token.value}`)
      .send({ answer })
      .expect(201)
    const user = body.users.find(element => element._id == luis._id)
    expect(user).to.have.property('answer', answer)
  })

})
