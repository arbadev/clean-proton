'use strict'

import Model from 'proton-mongoose-model'

describe('Spark Model', () => {
  it('should create a new spark', function*() {
    const spark = {
      from: {
        user: new Model.adapter.Types.ObjectId(),
        levels: {
          one: { decision: true },
        },
      },
      to: {
        user: new Model.adapter.Types.ObjectId(),
        levels: {
          one: { decision: true },
        },
      },
      status: 'undefined',
    }
    try {
      yield Spark.create(spark)
    } catch (err) {
      proton.log.error(`Error creating the spark ${err}`)
    }
  })
})
