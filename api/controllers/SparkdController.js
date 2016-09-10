
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

  * addMessage() {
    try {
      const from = this.request.user._id
      const { message } = this.request.body
      const spark = yield Sparkd.addMessage(this.params.spark, from, message)
      this.status = 201
      this.response.body = spark
    } catch (err) {
      const message = 'An error ocurred adding the message to an spark'
      proton.log.error(message, err)
      this.status = 400
    }
  }


}
