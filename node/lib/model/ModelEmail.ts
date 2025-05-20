"use strict";
const nodemailer = require("nodemailer");

export class EMails
{
	public sendEmais(edata:any, callback:(error: any, data:any)=>void){
        /* var smtpTransport = nodemailer.createTransport({
            host: edata.setting.domain,
            port: edata.setting.smtp_port,
            secure: false, // use SSL
            auth: {
                user: edata.setting.username,
                pass: edata.setting.password
            }
            }); */
            var smtpConfig = {
                host: edata.setting.domain,
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: edata.setting.username,
                    pass: edata.setting.password
                }
            };
            var smtpTransport = nodemailer.createTransport(smtpConfig);
        // verify connection configuration
        /* transporter.verify(function(error:any, success:any) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        }); */
        console.log(edata);
        let maildata = edata.maildata;

        var mailOptions = {
            from: edata.setting.fullname+" <"+edata.setting.emailid+">",
            to: maildata.useremail,
            //cc: maildata.fromname+" <"+maildata.emailid+">",
            replyTo: maildata.fromname+" <"+maildata.emailid+">",
            subject: maildata.subject,
           // text: maildata.mailbody,
            html: maildata.mailbody
            };
        
            smtpTransport.sendMail(mailOptions, function(error:any, info:any){
            if (error) {
                console.log(error);
                callback(0, error);
            } else {
                console.log('Email sent: ' + info.response);
                callback(1, info);
            }
            });

            smtpTransport.close();
	}
}