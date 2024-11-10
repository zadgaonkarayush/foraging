import sgMail from '@sendgrid/mail';


// Replace with your SendGrid API key
sgMail.setApiKey('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');

const msg = {
  to: 'recipient@example.com', // Recipient's email address
  from: 'zadgaonkarayush@gmail.com', // Your verified SendGrid sender email
  subject: 'Hello from SendGrid',
  text: 'This is a test email sent using SendGrid!',
  html: '<strong>This is a test email sent using SendGrid!</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent successfully!');
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });
