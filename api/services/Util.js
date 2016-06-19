'use strict'

import Service from 'proton-service'
import Model from 'proton-mongoose-model'

export default class Util extends Service {

  getObjectId(id) {
    const { ObjectId } = Model.adapter.Types
    return ObjectId.isValid(id) ? new ObjectId(id) : null
  }
}
