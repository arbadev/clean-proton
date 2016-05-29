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
   * @description this method gets the params (from , to), and find if a Spark
   alredy exist with those users, if exist it will update the data with their
   answers, otherwise create a new spark with the undefined status waiting for
   the other User asnwer
   * @author Andres Barradas <andres@nucleos.io>
   * @param from: this always will be the client who ask for a relationship
   * @param to: is the user which its asked for a relationship
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

  /**
   * @description this method gets the params (from , to), and find a spark where
   the users are and update their relationship
   * @author Andres Barradas <andres@nucleos.io>
   * @param from: this always will be the client which want to start the next lv
   * @param level: {two: { decision: true, message: 'url' } }
   */

  static * updateLevel(id, userId, level) {
    const criteria = { _id: new Spark.types.ObjectId(id) }
    const spark = yield Spark.findOne(criteria)
    const sparkMate = spark.from.user == userId : spark.to ? spark.from
    const key = spark.from.user == userId : 'from' ? 'to'
    const [levelName] = Object.getOwnPropertyNames(level)
    const decision = level[levelName].decision
    // let status = !decision ? 'terminated' : sparkMate.levels[levelName] && sparkMate.levels[levelName].decision ? levelName : spark.status

    if (!decision) {
      let status = 'terminated'
    }else if (sparkMate.levels[levelName] && sparkMate.levels[levelName].decision) {
      status = levelName
    }else {
      status = spark.status
    }

    const key = spark.from.user == userId ? 'from' : 'to'
    const updateData = {
      status,
      `${key}.levels`: Object.assign({}, spark[key].levels, level),
    }

    const updatedSpark = yield Spark.findOneAndUpdate(criteria, updateData, { new: true })
    const pushMessage = {
      event: 'updateMessage',
      data: { _id: id }
    }
    NotificationService.sendPush(sparkMate.user, pushMessage)
    return return Promise.resolve(updatedSpark)
  }

}
