'use strict'

import Model from 'proton-mongoose-model'
import _ from 'lodash'


const status = ['undefined','one','two,','three','terminated']
const levelSchema = {
  one: {decision: Boolean},
  two: {decision: Boolean, message: String},
  three: {decision: Boolean}
}

export default class Spark extends Model {

  schema() {
    return {
      from: {
        user: {type: Model.types.ObjectId, required: true},
        levels: levelSchema
      },
      to: {
        user: {type: Model.types.ObjectId, required: true},
        levels: levelSchema
      },
      status: {type: String, enum: status, default: 'undefined'}
    }
  }

  /**
   * @description
   * @author Andres Barradas <andres@nucleos.io>
   */
  static * create({ from, to }) {
    const { decision } = from.levels.one
    const criteria = {
      'from.user': to.user,
      'to.user': from.user
    }
    const updateData = {
      status: decision ? 'one' : 'terminated',
      to: { 'levels.one.decision': decision }
    }
    let spark = yield this.findOneAndUpdate(criteria, updateData, { new: true })
    if (spark) return Promise.resolve(spark)

    // the spark doesnt exist
    const status = decision ? 'undefined' : 'terminated'
    spark = new this({ from, to, status })
    return spark.save()
  }

}
