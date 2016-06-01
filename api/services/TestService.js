'use strict'

import Service from 'proton-service'

export default class TestService extends Service {

  * test() {
    const results = yield [this.t1(), this.t2(), this.t3()]
    proton.log.debug('tests', results)
    return Promise.resolve('end test . . . ')
  }

  t1() {
    return Promise.resolve('test 1')
  }


  t2() {
    return Promise.resolve('test 2')
  }


  t3() {
    return Promise.resolve('test 3')
  }

}
