/* eslint max-len: 0 */
'use strict'

import Model from 'proton-mongoose-model'

// Declarative section
const { ObjectId } = Model.adapter.Types

describe.skip('All flow for create a spark', () => {
  it('createSpark', function*() {
    const user1 = new ObjectId()
    const user2 = new ObjectId()
    const like1 = {
      from: user1,
      to: user2,
      value: 'like',
    }
    const like2 = {
      from: user2,
      to: user1,
      value: 'like',
    }
    yield Like.create(like1)
    yield Like.create(like2)
  })
})
