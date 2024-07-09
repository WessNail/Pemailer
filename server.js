const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Setup your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Replace with your email service
  auth: {
    user: 'tane3.14159@gmail.com',  // Your email
    pass: 'Ibmhf$00.00'  // Your email password or app-specific password
  }
});

app.post('/send-email', (req, res) => {
  const { to, subjects, body } = req.body;

  const sendPromises = subjects.map(subject => {
    const mailOptions = {
      from: 'tane3.14159@gmail.com',
      to: to,
      subject: subject,
      text: body
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve(info);
        }
      });
    });
  });

  Promise.all(sendPromises)
    .then(() => res.status(200).send('All emails sent successfully'))
    .catch(error => res.status(500).send('Error sending emails'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});