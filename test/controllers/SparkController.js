import supertest from 'co-supertest'
import app from '../../server.js'
import { expect } from 'chai'
import Model from 'proton-mongoose-model'


const request = supertest(app)

describe('SparkController', () => {
  let { barbara, luis, carlos, marian, alex, andres, sparkd } = {}
  let users = [
    {
      firstName: 'Barbarita',
      email: 'baba@gmail.com',
      facebookId: 1,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
      gender: 'female',
      coordinates: [7.88629051, -62.8513232],
    },
    {
      firstName: 'luis',
      email: 'luis@nucleos.io',
      facebookId: 2,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
      gender: 'male',
      coordinates: [7.88629051, -62.8513232],
    },
    {
      firstName: 'Carlos',
      email: 'carlos@nucleos.io',
      facebookId: 3,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
      gender: 'male',
      coordinates: [7.88629051, -62.8513232],
    },
    {
      firstName: 'Marian',
      email: 'marian@nucleos.io',
      facebookId: 4,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
      gender: 'female',
      coordinates: [7.88629051, -62.8513232],
    },
    {
      firstName: 'Alexander',
      email: 'alex@nucleos.io',
      facebookId: 5,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
      gender: 'male',
      coordinates: [7.88629051, -62.8513232],
    },
    {
      firstName: 'Andres',
      email: 'andres@nucleos.io',
      facebookId: 6,
      avatar: 'http://res.cloudinary.com/nucleos/image/upload/v1468541626/1f84ab06f0513b197ffd282c0b615669.jpg',
      gender: 'male',
      coordinates: [7.88629051, -62.8513232],
    },
  ]

  before(function*() {
    const [firstLanguage] = yield Language.find({})
    users = users.map(u => Object.assign(u, { languages: [firstLanguage._id] }));
    [barbara, luis, carlos, marian, alex, andres] = yield User.create(users)
    sparkd = yield Sparkd.create({ users: [barbara, luis] })

    yield Sparkd.create([
      { users: [barbara, carlos] },
      { users: [barbara, marian] },
      { users: [barbara, alex] },
      { users: [barbara, andres] },
    ])

    barbara.token = yield Token.generate(barbara.facebookId)
    luis.token = yield Token.generate(luis.facebookId)
  })

  after(function*() {
    yield [User.remove({}), Token.remove({})]
  })

  it('Barbara add question to his sparkd with Luis', function*() {
    const question = 'hola'
    const { body } = yield request
      .post(`/sparkds/${sparkd._id}/questions`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .send({ question })
      .expect(201)
    expect(body.me).to.have.property('question', question)
  })

  it('Barbara cant respond if not exist a question from Luis', function*() {
    const answer = 'hola'
    yield request
      .post(`/sparkds/${sparkd._id}/answers`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .send({ answer })
      .expect(400)
  })

  it('Luis add an answer to the sparkd that he has with Barbara', function*() {
    const answer = 'hola'
    const { body } = yield request
      .post(`/sparkds/${sparkd._id}/answers`)
      .set('Authorization', `Bearer ${luis.token.value}`)
      .send({ answer })
      .expect(201)
    expect(body.me).to.have.property('answer', answer)
    proton.log.debug('body', body)
  })

  it('Find sparkds', function*() {
    const { body, headers } = yield request
      .get('/sparkds?level=1&status=sparking')
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(200)
    proton.log.debug('headers', headers)
    proton.log.debug('body', body)
  })

  it('Find one sparkd', function*() {
    const { body, headers } = yield request
      .get(`/sparkds/${sparkd._id}`)
      .set('Authorization', `Bearer ${barbara.token.value}`)
      .expect(200)
    proton.log.debug('body', body)
  })
})
