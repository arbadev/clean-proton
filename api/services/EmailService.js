'use strict'

import Service from 'proton-service'
import sg from 'sendgrid'
import { mail } from 'sendgrid'
// let sg = require('sendgrid')(process.env.SENDGRID_API_KEY)


export default class EmailService extends Service {
  constructor(app) {
    super(app)
    this.sg = sg(process.env.SENDGRID_API_KEY)
  }
  sendMail(mSubject, mContent) {
    const fromEmail = new mail.Email('no-reply@sparkd.com')
    const toEmail = new mail.Email('nucleos.test@gmail.com')
    const subject = mSubject
    const cont = `${mContent.reason} -- ${mContent.description} -- ${mContent.from}`
    const content = new mail.Content('text/plain', cont)
    const email = new mail.Mail(fromEmail, subject, toEmail, content)
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: email.toJSON(),
    })
    this._sendRequest(request)
  }

  _sendRequest(request) {
    sg.API(request)
    .then(response => {
      proton.log.error(response.statusCode)
    })
    .catch(error => {
      proton.log.error(error.response.statusCode)
    })
  }
}
