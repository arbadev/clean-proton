'use strict'

import Service from 'proton-service'
let helper = require('sendgrid').mail
let sg = require('sendgrid')(process.env.SENDGRID_API_KEY)


export default class EmailService extends Service {

  sendReportMail(reason, description) {

    let fromEmail = new helper.Email('no-reply@sparkd.com')
    let toEmail = new helper.Email('nucleos.test@gmail.com')
    let subject = 'Report Mail'
    let content = new helper.Content('text/plain', reason + ' ' + description)
    let mail = new helper.Mail(fromEmail, subject, toEmail, content)

    let request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    })

    sg.API(request, function(error, response) {
      console.log(response.statusCode)
      console.log(response.body)
      console.log(response.headers)
    })
  }
}
