'use strict'

import Service from 'proton-service'

export default class NotificationService extends Service {

  * sendPush(recipient, data) {
    const tags = [{
      key: 'user',
      relation: '=',
      value: recipient,
    }]
    const push = yield pushClient.setTags(tags).setData(data).setAsBackground().send()
    proton.log.info('Sent push', tags, data, push)
    return push
  }
}
