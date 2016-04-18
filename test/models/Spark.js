'use strict'

import supertest from 'co-supertest'
import mongoose from 'mongoose'
import app from '../../server.js'



describe('Spark Model', () => {

  it('should create a new spark', function*() {
    const spark = {
      from: {
        user: mongoose.Types.ObjectId(),
        levels: {
          one: { decision: true }
        }
      },
      to: {
        user: mongoose.Types.ObjectId(),
        levels: {
          one: { decision: true }
        }
      },
      status: 'undefined'
    }
    try {
      const record = yield Spark.create(spark)
      proton.log.debug(`A new spark has been created ${record}`)
    } catch(err) {
      proton.log.error(`Error creating the spark ${err}`)
    }
  })

})
