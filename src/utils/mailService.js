
import { SENDER_MAIL } from '../constants.js'
console.log(SENDER_MAIL)
import Mailjet from 'node-mailjet'

const mailjet = new Mailjet({
  apiKey: process.env.MAIL_API_KEY,
  apiSecret: process.env.MAIL_SECRET_KEY
});

const sendEmail = async (recipientMail, receivedURL) => {
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
            `<h3> Dear Reciepent, <br />Here is your password reset link <a href=${receivedURL}>${receivedURL}</a>!</h3><br />Thank You, <br />Team Youtube-Twitter`,

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

