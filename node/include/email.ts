const nodemailer = require('nodemailer');

export const sendMail = (option:any)=> {

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'prince.code404@gmail.com',
    pass: 'yxndixtdfgrfvyof'
  }
});

const mailOptions = {
    from: 'your-email@gmail.com',
    to: option.email,
    subject: 'Celetel Account Login Information',
    text: `
    Dear ${option.first_name},
    We are pleased to provide you with the login details for your email account. Please keep this information confidential and take necessary precautions to ensure the security of your account.
    Email ID: ${option.email}
    Password: ${option.password}
    To access your email account, please follow these steps:
    Go to the email login page [Provide the URL].
    Enter your email ID mentioned above.
    Use the provided password to log in.
    Upon logging in, we strongly recommend changing the password to a more secure one. You can do this by navigating to the account profile section.
    We value the security and privacy of our users, and we appreciate your cooperation in keeping your account information secure.
    Best regards,
    [Your Name] 
    [Your Position/Company] 
    [Contact Information]`
  };  

  transporter.sendMail(mailOptions, function(error: { message: any; }, info: { messageId: string; }) {
    if (error) {
      console.log('Error occurred:');
      console.log(error.message);
    } else {
      console.log('Email sent successfully!');
      console.log('Message ID: ' + info.messageId);
    }
  });
}


