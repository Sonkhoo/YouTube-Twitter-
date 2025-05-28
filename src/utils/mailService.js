
import { SENDER_MAIL } from '../constants'

const mailjet = require('node-mailjet').connect(
  process.env.MAIL_API_KEY,
  process.env.MAIL_SECRET_KEY
)

const sendEmail = async (recipientMail) => {
  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: SENDER_MAIL,
            Name: 'Youtube-Twitter',
          },
          To: [
            {
              Email: recipientMail,
              Name: 'You',
            },
          ],
          Subject: 'My first Mailjet Email!',
          TextPart: 'Greetings from Mailjet!',
          HTMLPart:
            '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
        },
      ],
    })

    const result = await request
    
    console.log(result.body)
  } catch (err) {
    console.error('Error:', err.statusCode, err.message)
  }
}

export default sendEmail

