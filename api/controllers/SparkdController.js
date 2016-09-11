'use strict'

import Controller from 'proton-controller'

export default class SparkdController extends Controller {

  /**
   *
   */
  * find() {
    try {
      this.status = 200
    } catch (err) {
      proton.log.error('SparkdController.find', err)
      this.status = 400
    }
  }

  /**
   * @method addQuestion
   * @description When a user made this request in the users array in the object
   * that belongs to him it is added the question field which contain an url with
   * a voice note
   * @author Luis Hernandez
   */
  * addQuestion() {
    try {
      const { user } = this.request
      const { question } = this.request.body
      const spark = yield Spark.addQuestion(this.params.spark, user._id, question)
      this.response.status = 201
      this.response.body = spark
    } catch(err) {
      proton.log.error(err)
      this.response.status = 400
    }
  }


  /**
   * @method addAnswer
   * @description When a user made this request in the users array in the object
   * that belongs to him it is added the answer field which contain an url with
   * a voice note
   * @author Luis Hernandez
   */
  * addAnswer() {
    try {
      const { user } = this.request
      const { answer } = this.request.body
      const spark = yield Spark.addAnswer(this.params.spark, user._id, answer)
      this.response.status = 201
      this.response.body = spark
    } catch(err) {
      proton.log.error(err)
      this.response.status = 400
    }
  }

}
