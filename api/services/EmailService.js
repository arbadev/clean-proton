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
  sendReportMail() {
    const fromEmail = new mail.Email('no-reply@sparkd.com')
    const toEmail = new mail.Email('a3barradas@gmail.com')
    const subject = 'Report Mail'
    const content = new mail.Content('text/plain', 'BBBBBBBBBBBBBBBBBBB')
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

  // sendFeedbackMail(tittle, description) {
  //
  //   let fromEmail = new helper.Email('no-reply@sparkd.com')
  //   let toEmail = new helper.Email('nucleos.test@gmail.com')
  //   let subject = 'Report Mail'
  //   let content = new helper.Content('text/plain', tittle + ' ' + description)
  //   let mail = new helper.Mail(fromEmail, subject, toEmail, content)
  //
  //   let request = sg.emptyRequest({
  //     method: 'POST',
  //     path: '/v3/mail/send',
  //     body: mail.toJSON(),
  //   })
  //
  //   sg.API(request, function(error, response) {
  //     console.log(response.statusCode)
  //     console.log(response.body)
  //     console.log(response.headers)
  //   })
  // }
}
