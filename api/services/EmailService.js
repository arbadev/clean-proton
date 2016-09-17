'use strict'
// path.join(__dirname, 'views')
import Service from 'proton-service'
import sg from 'sendgrid'
import hogan from 'hogan.js'
import fs from 'fs'
import path from 'path'

export default class EmailService extends Service {
  constructor(app) {
    super(app)
    this.sg = sg(process.env.SENDGRID_API_KEY)
  }

  sendReportMail(mSubject, mContent) {
    const templatePath = path.join(`${__dirname}/../`, 'views')
    const template = fs.readFileSync(`${templatePath}/reportTemplate.html`, 'utf-8')
    const compliedTemplate = hogan.compile(template)
    proton.log.debug('EmailService.sendMail content', mContent)
    // const cont = `${mContent.reason} -- ${mContent.description} -- ${mContent.from}`
    proton.log.debug('sg', this.sg.emptyRequest)
    const request = this.sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                email: 'nucleos.test@gmail.com',
              },
            ],
            subject: mSubject,
          },
        ],
        from: {
          email: 'no-reply@sparkd.com',
        },
        content: [
          {
            type: 'text/html',
            value: compliedTemplate.render(mContent),
          },
        ],
      },
    })
    this._sendRequest(request)
  }

  sendFeedbackMail(mSubject, mContent) {
    const templatePath = path.join(`${__dirname}/../`, 'views')
    const template = fs.readFileSync(`${templatePath}/feedbackTemplate.html`, 'utf-8')
    const compliedTemplate = hogan.compile(template)
    proton.log.debug('EmailService.sendMail content', mContent)
    // const cont = `${mContent.reason} -- ${mContent.description} -- ${mContent.from}`
    const request = this.sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                email: 'nucleos.test@gmail.com',
              },
            ],
            subject: mSubject,
          },
        ],
        from: {
          email: 'no-reply@sparkd.com',
        },
        content: [
          {
            type: 'text/html',
            value: compliedTemplate.render(mContent),
          },
        ],
      },
    })
    this._sendRequest(request)
  }

  _sendRequest(request) {
    this.sg.API(request)
    .then(response => {
      proton.log.debug(response.statusCode)
    })
    .catch(error => {
      proton.log.error(error.response.statusCode)
    })
  }
}
