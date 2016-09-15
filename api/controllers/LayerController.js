
import Controller from 'proton-controller'

export default class LayerController extends Controller {

  * getSession() {
    try {
      const user = this.request.user._id
      const { nonce } = this.request.body
      const { LayerService } = proton.app.services
      const data = yield LayerService.createSession({user, nonce})
      this.response.body = { token: data.session_token }
    } catch (err) {
      proton.log.error('Error gerating a layer session token', err)
      this.response.status = 400
    }
  }

}
