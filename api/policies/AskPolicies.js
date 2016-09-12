import Policy from 'proton-policy'
import Model from 'proton-mongoose-model'


export default class AskPolicies extends Policy {

  * cansAsk(next) {
    try {
      const criteria = { _id: Model.parseObjectId(this.params.sparkd) }
      const sparkd = yield Sparkd.findOne(criteria)
      const user = sparkd.users.find(e => e._id.toString() == this.request.user._id)
      if (user.question) {
        const message = `The user ${user._id} has already made a question`
        throw new Error(message)
      }
      yield next
    } catch (err) {
      proton.log.error(err.message)
      this.response.status = 400
    }
  }

  * canReply(next) {
    try {
      const criteria = { _id: Model.parseObjectId(this.params.sparkd) }
      const sparkd = yield Sparkd.findOne(criteria)
      const user = sparkd.users.find(e => e._id.toString() != this.request.user._id)
      if (!user.question) {
        const message = `The user ${this.request.user._id} cant respond because the user ${user._id} no has asked him`
        throw new Error(message)
      }
      yield next
    } catch (err) {
      proton.log.error(err.message)
      this.response.status = 400
    }
  }

}
