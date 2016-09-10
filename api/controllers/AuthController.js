
import Controller from 'proton-controller'

export default class AuthController extends Controller {

  * authenticate() {
    try {
      const { facebookId } = this.request
      const token = yield Token.generate(facebookId)
      const user = yield User.me({ facebookId })
      this.response.body = { user, token: token.value }
    } catch (err) {
      proton.log.error(err)
      this.response.status = 400
    }
  }

}
