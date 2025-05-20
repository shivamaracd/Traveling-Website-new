/* import { randomBytes } from 'crypto'; */
import { Request, Response, NextFunction } from "express";
import { SessionManagment } from "../lib/model/Session";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { RawView } from "../lib/view/RawView";
import { Res406 } from "../lib/view/406";
/* import md5 from 'md5'; */
import { ModelOtherUpload } from '../lib/model/ModelOthersUpload';
/* import { log } from 'console'; */

var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shivam.gventure@gmail.com',
        pass: 'ftzmrfdghnypggrt'
    }
});

export class UserClass {
    constructor() { }


    /* login user api */

    public userLogin(req: Request, res: Response, next: NextFunction) {
        let sdata: any = req.body
        console.log("shivam", sdata)
        // if (sdata.token != '' && sdata.token != null && sdata.token != undefined) {
        //     let iQry = "SELECT us.`id`, us.`username`, us.`type`, us.`password`, us.`email`,  us.`company`, us.`balance` FROM `cel_users` us inner join session as utl on(utl.id=us.id) WHERE utl.`authkey`='" + sdata.token + "' ";
        //     let obj: any = new ModelRawQuery(req, res)
        //     obj.qrysql = iQry
        //     console.log("request", iQry)
        //     obj.prepare()
        //     obj.execute((error: any, result: any) => {
        //         if (result.length > 0) {
        //             let session = new SessionManagment(req, res, next)
        //             session.SetSession(result[0], (error: any, sessdata: any) => {
        //                 let objv = new RawView(res)
        //                 objv.prepare({ error: 1, message: "Successfully logged In", data: result[0] })
        //                 objv.execute()
        //             })
        //         } else {
        //             let objv = new RawView(res)
        //             objv.prepare({ error: 0, message: "You are not authorise person to access dashboard" })
        //             objv.execute()
        //         }

        //     })

        // } else {
            let iQry = "SELECT us.`id`, us.`username`, us.`type`, us.`password`, us.`email`,  us.`company`, us.`balance`,us.`plan`,us.`idparent`, us.`profile_image`, us.`idaccount` FROM `users` us WHERE us.`username`='" + sdata.username + "' AND us.`is_deleted`='0' ";
            let objn: any = new ModelRawQuery(req, res)
            objn.qrysql = iQry
            objn.prepare()
            objn.execute((error: any, result: any) => {
                if (result.length > 0 && sdata.username == result[0].username) {
                    if (result[0].type == 3) {
                        if (sdata.password == result[0].password) {
                            let session = new SessionManagment(req, res, next)
                            session.SetSession(result[0], (error: any, sessdata: any) => {
                                let objv = new RawView(res)
                                objv.prepare({ status: 200, message: "Successfully logged In", data: result[0] })
                                objv.execute()
                            })
                        } else {
                            let objv = new RawView(res)
                            objv.prepare({ error: 0, message: "You have entered wrong password" })
                            objv.execute()
                        }
                    } else {
                        let objv = new RawView(res)
                        objv.prepare({ error: 0, message: "You Account is Blocked , Please contact to Admin" })
                        objv.execute()
                    }
                } else {
                    let objv = new RawView(res)
                    objv.prepare({ error: 0, message: "You have entered wrong user" })
                    objv.execute()
                }
            })
        // }
    }





    /* change password api */
    public changePassword(req: Request, res: Response, next: NextFunction) {
        console.log("Password:::::::", req.body.data);
        let sdata = req.body.data;
        let userid = req.body.data.id;
        let obj = new ModelRawNonQuery(req, res);
        obj.nonqrysql = `UPDATE cel_users SET password='${sdata.password}' where email='${sdata.email}'`;
        obj.prepare()
        obj.execute((error: number, result: any) => {

            if (result) {
                let objv = new RawView(res);
                objv.prepare({ error: 0, message: "Password Updated Successfully!", data: result });
                objv.execute();
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ message: "Something went wrong" });
                objv.execute();
            }
        })
    }



    /* change password Profile */
    public profilepassupdate(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body.data;
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            let objs = new ModelRawQuery(req, res);
            objs.qrysql = "SELECT password FROM users WHERE id = '" + sessdata.id + "'";
            objs.prepare()
            objs.execute((error: number, result: any) => {
                if (error == 1) {
                    if (result.length > 0) {
                        console.log("confirmpassword", result[0].password, sdata.password)
                        if (result[0].password != sdata.oldpassword) {
                            let objv = new RawView(res);
                            objv.prepare({ error: 1, message: "Your old password is wrong!", data: result });
                            objv.execute();
                        } else {
                            if (result[0].password == sdata.password) {
                                console.log("sdatapass",result[0].password,sdata.password)
                                res.send({ error: 1, message: "Old password and New password is same please Enter other Password!" });
                            } else {
                                let obj = new ModelRawNonQuery(req, res)
                                obj.nonqrysql = "UPDATE users SET password='" + sdata.password + "' WHERE id='" + sessdata.id + "'";
                                obj.prepare();
                                obj.execute((error: number, result: any) => {
                                    res.send({ error: 0, message: "Password Update Successfully!" });
                                })
                            }
                        }

                    } else {
                        res.send({ error: 1, message: "Your New Password and Confirm Password is Mismatch" });
                    }
                } else {
                    res.send({ error: 1, message: "Something went wrong" });
                }

            })
        })
    }

    /* get change password data*/
    // public getChangePasswordData(req: Request, res: Response, next: NextFunction) {
    //     let sdata = req.body.data;
    //     console.log('Get profile data', sdata);
    //     let obj = new ModelRawQuery(req, res);
    //     obj.qrysql = `SELECT * FROM cel_users where id = ${req.query.type}`;
    //     obj.prepare();
    //     obj.execute((error: any, result: any) => {
    //         if (result) {
    //             let objv = new RawView(res);
    //             objv.prepare({ error: 0, message: "Successfully Fetched!", data: result });
    //             objv.execute();
    //         }
    //         else {
    //             let objv = new RawView(res);
    //             objv.prepare({ message: "Something went wrong" });
    //             objv.execute();
    //         }
    //     })
    // }

    /* get profile records */
    public getProfileData(req: Request, res: Response, next: NextFunction) {
        let aValue :any = req.query.type
        let sdata = JSON.parse(aValue);
        console.log("sdata adcjgad", sdata.id);
        let obj = new ModelRawQuery(req, res);
        obj.qrysql = `SELECT * FROM cel_users where id = ${sdata.id}`;
        obj.prepare();
        obj.execute((error: any, result: any) => {
            if (result) {
                let objv = new RawView(res);
                objv.prepare({ error: 0, message: "Profile data Successfully Fetched!", data: result });
                objv.execute();
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ message: "Something went wrong" });
                objv.execute();
            }
        })
    }

    public userLogout(req: Request, res: Response, next: NextFunction) {
        // let sdata: any = []
        // sdata = JSON.parse(req.body.data);
        console.log(req.body.data)
        let obj = new ModelRawNonQuery(req, res);
        obj.nonqrysql = "DELETE FROM session where authkey = '" + req.body.data + "'";
        obj.prepare();
        obj.execute((error: any, result: any) => {
            if (result) {
                let objv = new RawView(res);
                objv.prepare({ error: 0, message: "LogOut Successfully", data: result });
                objv.execute();
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ message: "Something went wrong" });
                objv.execute();
            }
        })
    }



    /* get package data  */
    public getpackagesdata(req: Request, res: Response, next: NextFunction) {
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            if (error == 1) {
                let obj = new ModelRawQuery(req, res);
                obj.qrysql = `SELECT package_id FROM cel_users WHERE id = ${sessdata.id}`;
                obj.prepare()
                obj.execute((error: any, result: any) => {
                    if (result) {
                        let mdata = result[0].package_id;
                        console.log("sdef", mdata)
                        let obju = new ModelRawQuery(req, res);
                        obju.qrysql = `SELECT * FROM package WHERE id = ${mdata} `;
                        obju.prepare()
                        obju.execute((error: number, udata: any) => {
                            let objv = new RawView(res)
                            objv.prepare({ error: 0, message: "get Successfully!", result: udata });
                            objv.execute()
                        })
                    } else {
                        let objv = new RawView(res)
                        objv.prepare({ error: 1, message: "Something went wrong" });
                        objv.execute()
                    }
                })

            }
            else {
                let objv = new Res406(res);
                objv.prepare(session);
                objv.execute();
            }
        });
    }



    /* update balance api  */

    public updatepayment(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body.data;
        console.log(sdata);
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            if (error == 1) {
                let obj = new ModelRawNonQuery(req, res);
                obj.nonqrysql = `UPDATE cel_users SET balance = '${sdata.balance}', description = '${sdata.description}', payment_type = '${sdata.payment_type}' WHERE id = ${sdata.id}`;
                obj.prepare()
                obj.execute((error: number, sdata: any) => {
                    let objv = new RawView(res)
                    objv.prepare({ error: 0, message: "Update Successfully!", data: sdata });
                    objv.execute()
                })
            }
            else {
                let objv = new Res406(res);
                objv.prepare(session);
                objv.execute();
            }
        });
    }

    /* -----------------------start reset password and send mail to user -------------------------------------*/


    public resetpassword(req: Request, res: Response, next: NextFunction) {
        console.log("req data ::", req.body)
        let sdata = req.body
        console.log(sdata)
        let obj = new ModelRawQuery(req, res)
        obj.qrysql = "SELECT email FROM cel_users WHERE email='" + sdata.email + "'";
        obj.prepare()
        obj.execute((error: any, result: any) => {
            console.log("shivam", result)
            if (result.length > 0) {
                let rand = Math.floor(1000 + Math.random() * 9000);
                var mailOptions = {
                    from: 'shivam.gventure@gmail.com',
                    to: sdata.email,
                    subject: 'OTP Verification For IVR Dialer',
                    text: `This is your verification code - ${rand} for reset password for ${sdata.email};`
                };
                transporter.sendMail(mailOptions, function (error: any, info: { response: string; }) {
                    if (error) {
                        let objr = new RawView(res)
                        objr.prepare({ error: 1, message: "Something went wrong" })
                        objr.execute()
                    } else {
                        // console.log('Email sent: ' + info.response);
                        let obju = new ModelRawNonQuery(req, res)
                        obju.nonqrysql = "UPDATE cel_users SET otp_verification='" + rand + "' , status = '1' WHERE email='" + sdata.email + "'";
                        obju.prepare()
                        obju.execute((error1: any, updateData: any) => {
                            if (updateData.affectedRows) {
                                let objr = new RawView(res)

                                objr.prepare({ error: 0, message: "OTP Send Successfully" })
                                objr.execute()
                            } else {
                                let objr = new RawView(res)
                                objr.prepare({ error: 1, message: "Something went wrong" })
                                objr.execute()
                            }
                        })
                    }
                })
            } else {
                let objr = new RawView(res)
                objr.prepare({ error: 1, message: "Your email does't exist try again with correct email" })
                objr.execute()
            }
        })
    }

    public confirmotp(req: Request, res: Response, next: NextFunction) {
        console.log("req data otp::", req.body)
        let sdata = req.body
        console.log(sdata)
        let obj = new ModelRawQuery(req, res)

        obj.qrysql = "SELECT otp_verification FROM cel_users WHERE otp_verification='" + sdata.otp + "'";
        obj.prepare()
        obj.execute((error: any, result: any) => {
            if (result.length > 0) {
                let obju = new ModelRawNonQuery(req, res)
                obju.nonqrysql = "UPDATE cel_users SET otp_verification='0' , status = '0' WHERE email='" + sdata.email + "'";
                obju.prepare()
                obju.execute((error1: any, updateData: any) => {
                    if (updateData.affectedRows) {
                        let objr = new RawView(res)
                        objr.prepare({ error: 0, message: "OTP Verified Successfully" })
                        objr.execute()
                    } else {
                        let objr = new RawView(res)
                        objr.prepare({ error: 1, message: "Something went wrong" })
                        objr.execute()
                    }
                })

            } else {
                let objr = new RawView(res)
                objr.prepare({ error: 1, message: "Please enter correct otp." })
                objr.execute()
            }
        })
    }


    public update_password(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body.data;
        let id = req.query.id
        console.log('Query params', req.query.id);
        console.log("changes data >>>>>>", sdata);
        let obj = new ModelRawNonQuery(req, res);
        obj.nonqrysql = `UPDATE cel_users SET password = '${sdata.password}' WHERE id = '${id}'`;
        obj.prepare()
        obj.execute((error: number, sdata: any) => {
            let objv = new RawView(res)
            objv.prepare({ error: 0, message: "Password Updated Successfully!", data: sdata });
            objv.execute()
        })
    }

    /* update user profile records */

    public updateProfile(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body.data;
        let id = req.query.id
        console.log('Query params', req.query.id);
        console.log("changes data >>>>>>", sdata);

        let obj = new ModelRawNonQuery(req, res);
        obj.nonqrysql = `UPDATE users SET firstname = '${sdata.firstname}', lastname = '${sdata.lastname}', email = '${sdata.email}', contact = '${sdata.contact}', address = '${sdata.address}', country = '${sdata.country}'  WHERE id = '${id}'`;
        obj.prepare()
        obj.execute((error: number, sdata: any) => {
            if (sdata) {
                let objv = new RawView(res)
                objv.prepare({ error: 0, message: "Profile Updated Successfully!", data: sdata });
                objv.execute()
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ message: "Something went wrong" });
                objv.execute();
            }
        })
    }


    updateUserProfile(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body;
        let id = req.query.id
        let obj = new ModelRawNonQuery(req, res);
        if (!(sdata.filename == '-1')) {
            let objfile = new ModelOtherUpload(req, res)
            let fdata: any[] = objfile.fileUpload()
            let profile_pic = fdata[0].replace(/"/g, '\\"').replace(/'/g, "\\'")
            obj.nonqrysql = `UPDATE cel_users SET firstname = '${sdata.firstname}',profile_image='${profile_pic}', lastname = '${sdata.lastname}', email = '${sdata.email}', contact = '${sdata.contact}', address = '${sdata.address}', country = '${sdata.country}', bank_name = '${sdata.bankname}', account_number = '${sdata.accountnumber}'  WHERE id = '${id}'`;
        } else {
            obj.nonqrysql = `UPDATE cel_users SET firstname = '${sdata.firstname}', lastname = '${sdata.lastname}', email = '${sdata.email}', contact = '${sdata.contact}', address = '${sdata.address}', country = '${sdata.country}', bank_name = '${sdata.bankname}', account_number = '${sdata.accountnumber}'  WHERE id = '${id}'`;
        }
        obj.prepare()
        obj.execute((error: number, sdata: any) => {
            if (sdata) {
                let objv = new RawView(res)
                objv.prepare({ error: 0, message: "Profile Updated Successfully!", data: sdata });
                objv.execute()
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ message: "Something went wrong" });
                objv.execute();
            }
        })
    }


    //img upload
    public imgupload(req: Request, res: Response, next: NextFunction) {
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: number, sessdata: any) => {
            var sdata = req.body;
            console.log("sdata prince::", sdata);
            let size;
            let objfile = new ModelOtherUpload(req, res);
            let fdata: any = objfile.imageUpload();
            // size = (fdata[3] / 1024 / 1024).toFixed(3);
            // console.log('Upload...', fdata[3], size);
            const date = (new Date().toISOString().split('T')[0]);
            let obj1 = new ModelRawNonQuery(req, res);
            obj1.nonqrysql = "SELECT id FROM users where id='" + sessdata.id + "'";
            obj1.prepare()
            obj1.execute((error: any, result: any) => {
                console.log("result", result[0].id);
                if (result.length > 0) {
                    let obj = new ModelRawNonQuery(req, res)
                    obj.nonqrysql = "UPDATE users SET profile_image ='" + fdata[0] + "' WHERE id='" + result[0].id + "'";
                    obj.execute((error: any, lastid: any) => {
                        let objv = new RawView(res);
                        objv.prepare({
                            message: "Profile Uploaded Successfully.",
                            insertedid: lastid.insertId,
                            filename: fdata[0]
                        });
                        objv.execute();
                    });
                } else {
                    console.log("upload valid data");

                }
            })
        })
    }

    //Company Doc upload
    public companyDoc(req: Request, res: Response, next: NextFunction) {
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: number, sessdata: any) => {
            var sdata = req.body;
            var type = sdata.type;
            console.log("sdata Prince::", sdata);
            if (type == 20) {
                let objfile = new ModelOtherUpload(req, res);
                let fdata: any = objfile.CompanyDocument();
                const date = (new Date().toISOString().split('T')[0]);
                let obj1 = new ModelRawNonQuery(req, res);
                obj1.nonqrysql = "SELECT company_certificate FROM cel_account where idaccount='" + sessdata.idaccount + "'";
                obj1.prepare()
                obj1.execute((error: any, result: any) => {
                    console.log("result", result[0].id);
                    if (result.length > 0) {
                        let obj = new ModelRawNonQuery(req, res)
                        obj.nonqrysql = "UPDATE cel_account SET company_certificate ='" + fdata[0] + "' WHERE idaccount='" + sessdata.idaccount + "'";
                        obj.execute((error: any, lastid: any) => {
                            let objv = new RawView(res);
                            objv.prepare({
                                message: "Company Certificate Uploaded Successfully.",
                                insertedid: lastid.insertId,
                                filename: fdata[0]
                            });
                            objv.execute();
                        });
                    } else {
                        console.log("upload valid data");

                    }
                })
            } else if (type == 21) {
                let objfile = new ModelOtherUpload(req, res);
                let fdata: any = objfile.CompanyDocument();
                const date = (new Date().toISOString().split('T')[0]);
                let obj1 = new ModelRawNonQuery(req, res);
                obj1.nonqrysql = "SELECT company_pan_card FROM cel_account where idaccount='" + sessdata.idaccount + "'";
                obj1.prepare()
                obj1.execute((error: any, result: any) => {
                    console.log("result", result[0].id);
                    if (result.length > 0) {
                        let obj = new ModelRawNonQuery(req, res)
                        obj.nonqrysql = "UPDATE cel_account SET company_pan_card ='" + fdata[0] + "' WHERE idaccount='" + sessdata.idaccount + "'";
                        obj.execute((error: any, lastid: any) => {
                            let objv = new RawView(res);
                            objv.prepare({
                                message: "Company PAN Card Uploaded Successfully.",
                                insertedid: lastid.insertId,
                                filename: fdata[0]
                            });
                            objv.execute();
                        });
                    } else {
                        console.log("upload valid data");

                    }
                })
            } else if (type == 22) {
                let objfile = new ModelOtherUpload(req, res);
                let fdata: any = objfile.CompanyDocument();
                const date = (new Date().toISOString().split('T')[0]);
                let obj1 = new ModelRawNonQuery(req, res);
                obj1.nonqrysql = "SELECT director_pan_card FROM cel_account where idaccount='" + sessdata.idaccount + "'";
                obj1.prepare()
                obj1.execute((error: any, result: any) => {
                    console.log("result", result[0].id);
                    if (result.length > 0) {
                        let obj = new ModelRawNonQuery(req, res)
                        obj.nonqrysql = "UPDATE cel_account SET director_pan_card ='" + fdata[0] + "' WHERE idaccount='" + sessdata.idaccount + "'";
                        obj.execute((error: any, lastid: any) => {
                            let objv = new RawView(res);
                            objv.prepare({
                                message: "Director PAN Card Uploaded Successfully.",
                                insertedid: lastid.insertId,
                                filename: fdata[0]
                            });
                            objv.execute();
                        });
                    } else {
                        console.log("upload valid data");

                    }
                })
            } else {
                console.log("upload valid type");
            }
        })
    }

    public deleteCompanyUpload(req: Request, res: Response, next: NextFunction) {
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: number, sessdata: any) => {
            var sdata = req.body.data.docDetail;
            var type = Number(sdata);
            console.log("sdata Prince::", sdata);
            if (type == 20) {
                let obj1 = new ModelRawNonQuery(req, res);
                obj1.nonqrysql = "SELECT company_certificate FROM cel_account where idaccount='" + sessdata.idaccount + "'";
                obj1.prepare()
                obj1.execute((error: any, result: any) => {
                    console.log("result", result[0].id);
                    if (result.length > 0) {
                        let obj = new ModelRawNonQuery(req, res)
                        obj.nonqrysql = "UPDATE cel_account SET company_certificate ='" + '(NULL)' + "' WHERE idaccount='" + sessdata.idaccount + "'";
                        obj.execute((error: any, lastid: any) => {
                            let objv = new RawView(res);
                            objv.prepare({
                                message: "Company Certificate Deleted Successfully."
                            });
                            objv.execute();
                        });
                    } else {
                        console.log("upload valid data");

                    }
                })
            } else if (type == 21) {
                let obj1 = new ModelRawNonQuery(req, res);
                obj1.nonqrysql = "SELECT company_pan_card FROM cel_account where idaccount='" + sessdata.idaccount + "'";
                obj1.prepare()
                obj1.execute((error: any, result: any) => {
                    console.log("result", result[0].id);
                    if (result.length > 0) {
                        let obj = new ModelRawNonQuery(req, res)
                        obj.nonqrysql = "UPDATE cel_account SET company_pan_card ='" + '(NULL)' + "' WHERE idaccount='" + sessdata.idaccount + "'";
                        obj.execute((error: any, lastid: any) => {
                            let objv = new RawView(res);
                            objv.prepare({
                                message: "Company PAN Card Deleted Successfully."
                            });
                            objv.execute();
                        });
                    } else {
                        console.log("upload valid data");

                    }
                })
            } else if (type == 22) {
                let obj1 = new ModelRawNonQuery(req, res);
                obj1.nonqrysql = "SELECT director_pan_card FROM cel_account where idaccount='" + sessdata.idaccount + "'";
                obj1.prepare()
                obj1.execute((error: any, result: any) => {
                    console.log("result", result[0].id);
                    if (result.length > 0) {
                        let obj = new ModelRawNonQuery(req, res)
                        obj.nonqrysql = "UPDATE cel_account SET director_pan_card ='" + '(NULL)' + "' WHERE idaccount='" + sessdata.idaccount + "'";
                        obj.execute((error: any, lastid: any) => {
                            let objv = new RawView(res);
                            objv.prepare({
                                message: "Director PAN Card Deleted Successfully."
                            });
                            objv.execute();
                        });
                    } else {
                        console.log("upload valid data");

                    }
                })
            } else {
                console.log("upload valid type");
            }
        })
    }

    public adduserdata(req: Request, res: Response, next: NextFunction) {
        let firstdata = req.body.data.firstForm
        let seconddata = req.body.data.secondForm
        let thirddata = req.body.data.thirdForm
        let campaign_type = JSON.stringify(firstdata.campaignType)
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            console.log("Add user datad", sessdata);
            let obj = new ModelRawNonQuery(req, res);
            obj.nonqrysql = "INSERT INTO cel_users(firstname,lastname,email,contact,username,company_name,password,idparent,resource_allocation_type,campain_type,dnd,number_masking,ip_authentication,daily_upload_limit,plan,credit,payment_date,payment_refrence,transaction_no,remark,type,idaccount) VALUES ('" + firstdata.firstName + "','" + firstdata.lastName + "','" + firstdata.email + "','" + firstdata.phoneNumber + "','" + firstdata.userName + "','" + firstdata.parentUser + "','" + firstdata.password + "','" + sessdata.id + "','" + seconddata.allocationType + "','" + campaign_type + "','" + seconddata.dnd + "','" + seconddata.numberMasking + "','" + seconddata.ipAuthentication + "','" + seconddata.dailyDataUploadLimit + "','" + thirddata.planType + "','" + thirddata.credit + "','" + thirddata.paymentDate + "','" + thirddata.paymentReference + "','" + thirddata.transactionChequeNo + "','" + thirddata.remarks + "','3','" + sessdata.idaccount + "')";
            obj.prepare();
            obj.execute((error: any, result: any) => {
                if (result) {
                    let objv = new RawView(res);
                    objv.prepare({ status: 200, message: "User added Successfully", data: result });
                    objv.execute();
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 500, message: "Something went wrong" });
                    objv.execute();
                }
            })

        })
    }

    public getallaccount(req: Request, res: Response, next: NextFunction) {
        let sdata = req.query.type
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            let obj = new ModelRawQuery(req, res);
            obj.qrysql = "SELECT ur.id,ur.idaccount,ur.firstname,ur.lastname,ur.email,ur.expiry,ur.country,ur.phone_number,ur.contact,ur.call_broadcast,ur.gender,ur.website,ur.campain_type,ur.company_name,ur.company,ur.username,ur.password,ur.address,ur.is_active,ur.city,ur.postal_code,DATE_FORMAT(ur.`created_at`, '%Y-%m-%d') created_at,ur.status,ur.did_count, ur.plan, ur.dnd ,al.company_name FROM `cel_users` ur LEFT JOIN `cel_account` al ON ur.idaccount=al.idaccount WHERE ur.idaccount= '" + sessdata.idaccount + "' AND ur.is_deleted ='0' ORDER BY id DESC"
            obj.prepare();
            obj.execute((error: any, result: any) => {
                if (result) {
                    let objv = new RawView(res);
                    objv.prepare({ status: 200, message: "Data Featch Successfully", data: result });
                    objv.execute();
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 500, message: "Something went wrong" });
                    objv.execute();
                }
            })

        })
    }

    public deletedata(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body.data
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            let obj = new ModelRawQuery(req, res);
            obj.qrysql = "UPDATE `cel_users` SET `is_deleted` = '1' WHERE id = '" + sdata + "'";
            obj.prepare();
            obj.execute((error: any, result: any) => {
                if (result) {
                    let objv = new RawView(res);
                    objv.prepare({ status: 200, message: "Data deleted Successfully", data: result });
                    objv.execute();
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 500, message: "Something went wrong" });
                    objv.execute();
                }
            })

        })
    }

    public authkey(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body.data
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            let obj = new ModelRawNonQuery(req, res); ModelRawNonQuery
            obj.nonqrysql = "SELECT * FROM session where id='" + sdata + "'";
            obj.prepare();
            obj.execute((error: any, result: any) => {
                if (result) {
                    let objv = new RawView(res);
                    objv.prepare({ status: 200, message: "user Login Successfully", data: result });
                    objv.execute();
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 500, message: "Something went wrong" });
                    objv.execute();
                }
            })

        })
    }

    public getSingleUser(req: Request, res: Response, next: NextFunction) {
        let sdata = req.query.type
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            let obj = new ModelRawNonQuery(req, res); ModelRawNonQuery
            obj.nonqrysql = `SELECT ue.id,ue.firstname,ue.lastname, ue.email, ue.contact,ue.password,ue.campain_type,ue.otp_verification,
			ue.report_password,ue.multiple_login,ue.dnd,ue.data_encryption,ue.number_masking,ue.text_masking,ue.daily_upload_limit,
			ac.campaign_type  FROM  cel_users ue INNER JOIN cel_account ac ON ue.idaccount =ac.idaccount   WHERE id=${req.query.type} `;
            obj.prepare();
            obj.execute((error: any, result: any) => {
                if (result) {
                    let objv = new RawView(res);
                    objv.prepare({ status: 200, message: "DID Singledata Successfully", data: result });
                    objv.execute();
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 500, message: "Something went wrong" });
                    objv.execute();
                }
            })

        })
    }

    public updateusers(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body.data
        let ids = req.query.id
        console.log("Ashwnai tieair", sdata, req.query.id)
        let campaign_type = JSON.stringify(sdata.campaignType)
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            let obj = new ModelRawNonQuery(req, res);
            obj.nonqrysql = "UPDATE `cel_users` SET firstname = '" + sdata.firstName + "',lastname = '" + sdata.lastName + "',contact = '" + sdata.phone + "',password = '" + sdata.password + "',campain_type = '" + campaign_type + "',otp_verification = '" + sdata.otpAuthentication + "',report_password = '" + sdata.reportPassword + "',multiple_login = '" + sdata.multipleLogin + "',dnd = '" + sdata.dnd + "',data_encryption = '" + sdata.dataEncryption + "',number_masking = '" + sdata.numberMasking + "',text_masking = '" + sdata.textMasking + "',daily_upload_limit = '" + sdata.dailyDataUploadLimit + "'  WHERE id = '" + ids + "'";
            obj.prepare();
            obj.execute((error: any, result: any) => {
                if (result) {
                    let objv = new RawView(res);
                    objv.prepare({ status: 200, message: "User Data Updated Successfully" });
                    objv.execute();
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 500, message: "Something went wrong" });
                    objv.execute();
                }
            })

        })
    }


    // public masterUser(req: Request, res: Response, next: NextFunction) {
    // 	let sdata = req.query.type
    // 	let session = new SessionManagment(req, res, next);
    // 	session.GetSession((error: any, sessdata: any) => {
    // 		let obj = new ModelRawNonQuery(req, res); ModelRawNonQuery
    // 		obj.nonqrysql = `SELECT is_master_user FROM cel_users WHERE id = ${sessdata.id}`;
    // 		obj.prepare();
    // 		obj.execute((error: any, result: any) => {
    // 			if (result) {
    // 				let objv = new RawView(res);
    // 				objv.prepare({ status: 200, message: "Master data get Successfully", data: result });
    // 				objv.execute();
    // 			}
    // 			else {
    // 				let objv = new RawView(res);
    // 				objv.prepare({ status: 500, message: "Something went wrong" });
    // 				objv.execute();
    // 			}
    // 		})

    // 	})
    // }


    public isActive(req: Request, res: Response, next: NextFunction) {
        let ndata = req.body.data
        let sdata = ndata[0];
        let status = ndata[1];
        console.log('isActiveba', sdata)
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            let obj = new ModelRawQuery(req, res);
            if (status == 1) {
                obj.qrysql = "UPDATE `cel_users` SET `is_active` = '1',type='0' WHERE id = '" + sdata + "'";

            } else {
                obj.qrysql = "UPDATE `cel_users` SET `is_active` = '0',type='3' WHERE id = '" + sdata + "'";
            }
            obj.prepare();
            obj.execute((error: any, result: any) => {
                if (result) {
                    let objv = new RawView(res);
                    objv.prepare({ status: 200, message: "User status updated Successfully", data: result });
                    objv.execute();
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 500, message: "Something went wrong" });
                    objv.execute();
                }
            })


        })
    }
}