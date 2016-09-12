
import Controller from 'proton-controller'

export default class SparkdController extends Controller {

  * find() {
    const { user } = this.request
    const uri = `${this.request.origin}${this.request.path}`
    const params = this.query
    const opts = { user, uri, params }
    try {
      const { sparkds, pagination } = yield Sparkd.findByQueryParams(opts)
      this.response.body = sparkds
      this.set('Link', pagination)
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
      const sparkd = yield Sparkd.addQuestion(this.params.sparkd, user, question)
      this.response.status = 201
      this.response.body = sparkd
    } catch (err) {
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
      const sparkd = yield Sparkd.addAnswer(this.params.sparkd, user, answer)
      this.response.status = 201
      this.response.body = sparkd
    } catch (err) {
      proton.log.error(err)
      this.response.status = 400
    }
  }

}
