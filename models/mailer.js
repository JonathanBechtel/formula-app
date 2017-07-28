var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'jonathan@healthkismet.com',
        pass: 'sKLQ684j!'
    }
});

var message = module.exports = {
   welcome: function(email) {
    var mailOptions = {
          from: '"Jonathan at Health Kismet" <jonathan@healthkismet.com>', // sender address
          to: email, // list of receivers
          subject: 'Welcome to the Formula Generator!', // Subject line
          text: 'Hello, welcome to the formula generator.  This message signifies that you\'re officially signed up for the formula generator and can access the site with the e-mail address and password you recently created.  You can now login whenever you\'d like with the following e-mail address: ' + email + '.  If you have any questions about your account please e-mail support@healthkismet.com.', // plain text body
          html: '<p>Hello, welcome to the formula generator.  This message signifies that you\'re officially signed up for the formula generator and can access the site with the e-mail address and password you recently created.</p><p>You can now login whenever you\'d like with the following e-mail address: ' + email + '.</p><p>If you have any questions about your account please e-mail support@healthkismet.com.</p>' // html body
      };

    transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
      });
  }
}
