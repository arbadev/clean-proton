'use strict'

import Model from 'proton-mongoose-model'

export default class Report extends Model {

  schema() {
    return {
      reason: String,
      description: String,
      from: {
        type: Model.types.ObjectId,
        ref: 'User',
        required: true,
      },
      to: {
        type: Model.types.ObjectId,
        ref: 'User',
        required: true,
      },
    }
  }

}
