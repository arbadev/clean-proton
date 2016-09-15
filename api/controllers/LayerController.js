
import Controller from 'proton-controller'

export default class LayerController extends Controller {

  * getSession() {
    try {
      const user = this.request.user._id
      const { nonce } = this.request.body
      const { LayerService } = proton.app.services
      const token = yield LayerService.createSession({user, nonce})
      this.response.body = { token }
    } catch (err) {
      proton.log.error('errorrrrr', err.error)
      this.response.status = 400
    }
  }

}
