'use strict'

import Service from 'proton-service'

export default class NotificationService extends Service {

  sendPush(recipient, data) {
    const tag = {
      key: 'user',
      relation: '=',
      value: recipient
    }
    return pushClient.setTags([tag]).setData(data).setAsBackground().send()
  }
}
