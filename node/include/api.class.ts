import { Request, Response, NextFunction } from "express";
import { ModelCsvUpload } from "../lib/model/ModelCsvUpload";
import { ModelOtherUpload } from "../lib/model/ModelOthersUpload";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { RawView } from "../lib/view/RawView";
import { UploadDirectory } from "../config/setting.config";
import { Res406 } from "../lib/view/406";
var XLSX = require('xlsx');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

export class API {
    constructor() { }

    /* login user api */
    public userLogin(req: Request, res: Response, next: NextFunction) {
        let sdata: any = req.body
        let auth: any = Object.keys(sdata)
        let paramenter: any = Object.assign({}, (auth))
        if (paramenter[0] == 'username' && paramenter[1] == 'password') {
            if (sdata.token != '' && sdata.token != null && sdata.token != undefined) {
                let iQry = "SELECT us.`id`, us.`username`, us.`type`, us.`password`, us.`email`,  us.`company`, us.`balance` FROM `cel_users` us inner join session as utl on(utl.id=us.id) WHERE utl.`authkey`='" + sdata.token + "' ";
                let obj: any = new ModelRawQuery(req, res)
                obj.qrysql = iQry
                // console.log("request", iQry)
                obj.prepare()
                obj.execute((error: any, result: any) => {
                    if (result.length > 0) {
                        let session = new SessionManagment(req, res, next)
                        session.SetSession(result[0], (error: any, sessdata: any) => {
                            let objv = new RawView(res)
                            objv.prepare({ status: 200, message: "Successfully logged Inss", data: { id: result[0].id, company: result[0].company, authkey: result[0].authkey } })
                            objv.execute()
                        })
                    } else {
                        let objv = new RawView(res)
                        objv.prepare({ status: 401, message: "You are not authorise person to access dashboard" })
                        objv.execute()
                    }

                })

            } else {
                let iQry = "SELECT us.`id`, us.`username`, us.`type`, us.`password`, us.`email`,  us.`company`, us.`balance` FROM `cel_users` us WHERE us.`username`='" + sdata.username + "' AND type ='3' ";
                let obj: any = new ModelRawQuery(req, res)
                obj.qrysql = iQry
                obj.prepare()
                obj.execute((error: any, result: any) => {
                    if (result.length > 0) {
                        if (sdata.password == result[0].password) {
                            let session = new SessionManagment(req, res, next)
                            session.SetSession(result[0], (error: any, sessdata: any) => {
                                let objv = new RawView(res)
                                objv.prepare({ status: 200, message: "Successfully logged In", data: { id: result[0].id, company: result[0].company, authkey: result[0].authkey } })
                                objv.execute()
                            })
                        } else {
                            let objv = new RawView(res)
                            objv.prepare({ status: 401, message: "You have entered wrong password" })
                            objv.execute()

                        }
                    } else {
                        let objv = new RawView(res)
                        objv.prepare({ status: 401, message: "You have entered wrong username" })
                        objv.execute()

                    }
                })
            }
        } else {
            let objv = new RawView(res)
            objv.prepare({ status: 400, message: "Parameter missing" })
            objv.execute()
        }
    }

    //get contact data
    public ContactList(req: Request, res: Response, next: NextFunction) {
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            if (error == 1) {
                let obj = new ModelRawQuery(req, res);
                obj.qrysql = "SELECT id, `filename`, `total_count`, DATE_FORMAT(created_at,'%d-%m-%Y')`date` FROM cel_uploads_contact WHERE iduser = '" + sessdata.id + "' AND is_deleted=0";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    if (error == 1 && result.length > 0) {
                        let objv = new RawView(res);
                        objv.prepare({ status: 200, message: "Contact list data fetch successfully", data: result });
                        objv.execute();
                    }
                    else {
                        let objv = new RawView(res);
                        objv.prepare({ status: 404, message: "No data Found!" });
                        objv.execute();
                    }
                });
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ status: 401, message: "Invalid Authentication!" });
                objv.execute();
            }
        });
    }

    //getUploadBlock
    public Blocklist(req: Request, res: Response, next: NextFunction) {
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            if (error == 1) {
                let obj = new ModelRawQuery(req, res);
                obj.qrysql = "SELECT `id`, `filename`, `total_count`, DATE_FORMAT(created_at,'%d-%m-%Y')`date` FROM `cel_uploads_block` WHERE  iduser='" + sessdata.id + "' AND is_deleted=0 ";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    if (error == 1 && result.length > 0) {
                        let objv = new RawView(res);
                        objv.prepare({ status: 200, message: "Block list data fetch successfully", data: result });
                        objv.execute();
                    }
                    else {
                        let objv = new RawView(res);
                        objv.prepare({ status: 404, message: "No data Found!" });
                        objv.execute();
                    }
                })
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ status: 401, message: "Invalid Authentication!" });
                objv.execute();
            }
        });

    }

    //get Voice List
    public VoiceList(req: Request, res: Response, next: NextFunction) {
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            if (error == 1) {
                let obj = new ModelRawQuery(req, res);
                obj.qrysql = "SELECT id, `filename`, DATE_FORMAT(created_at,'%d-%m-%Y')`date`, `status`,CASE WHEN `status`='1' THEN 'Pending' WHEN `status`='2' THEN 'Approved' WHEN `status`='3' THEN 'Reject'ELSE 'Pending' END AS status  FROM cel_uploads_voice WHERE iduser = '" + sessdata.id + "'";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    if (error == 1 && result.length > 0) {
                        let objv = new RawView(res);
                        objv.prepare({ status: 200, message: "Voice List data fetch successfully", data: result });
                        objv.execute();
                    }
                    else {
                        let objv = new RawView(res);
                        objv.prepare({ status: 404, message: "No data Found!" });
                        objv.execute();
                    }
                });
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ status: 401, message: "Invalid Authentication!" });
                objv.execute();
            }
        });
    }

    //files uploade
    public uploadContact(req: Request, res: Response, next: NextFunction) {
        if (req.body.filename == '') {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "CSV file Not Found!" });
            objv.execute();
        } else {
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: number, sessdata: any) => {
                let newValue : any = req.file;
                if (error == 1) {
                    if (newValue.mimetype == 'text/csv') {
                        let objfile = new ModelCsvUpload(req, res);
                        let fdata: any = objfile.fileUpload();
                        let size = (fdata[3] / 1024 / 1024).toFixed(3);
                        let obja = new ModelRawNonQuery(req, res);
                        obja.nonqrysql = `INSERT INTO cel_uploads_contact(iduser, filename, file_type, filepath, size) VALUES ("${sessdata.id}","${fdata[0]}", "${req.body.type}", "${fdata[1]}", ${size})`;
                        obja.prepare();
                        obja.execute((error: any, result: any) => {
                            let lastid = result.insertId;
                            let obj = new ModelRawNonQuery(req, res)
                            obj.nonqrysql = "LOAD DATA LOCAL INFILE  '" + fdata[1] + fdata[0] + "' INTO TABLE cel_leads  FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (@cal1,@cal2,@cal3,@cal4,@cal5,@cal6,@cal7,@cal8,@cal9,@cal10,@cal11,@cal12) SET phone_no=@cal1, first_name=@cal2, last_name=@cal3, address1=@cal4, address2=@cal5, city=@cal6, state=@cal7, pincode=@cal8, branch_name=@cal9, representative_name=@cal10, iduser = '" + sessdata.id + "', upload_id='" + lastid + "'";
                            obj.prepare();
                            obj.execute((error: number, result: any) => {
                                let objd = new ModelRawQuery(req, res);
                                objd.qrysql = "SELECT COUNT(upload_id)`total` FROM cel_leads WHERE upload_id = '" + lastid + "'";
                                objd.prepare();
                                objd.execute((error: any, resultss: any) => {
                                    console.log("count:::", resultss)
                                    let totalcount = resultss[0].total
                                    let obj = new ModelRawNonQuery(req, res);
                                    obj.nonqrysql = "UPDATE `cel_uploads_contact` SET `total_count`= '" + totalcount + "' WHERE id = '" + lastid + "'";
                                    obj.prepare();
                                    obj.execute((error: any, result: any) => {
                                        if (error == 1) {
                                            let objv = new RawView(res);
                                            objv.prepare({ status: 200, message: `Contact File Uploaded Successfully!`, data: { id: lastid, filename: fdata[0] } });
                                            objv.execute();
                                        }
                                        else {
                                            let objv = new RawView(res);
                                            objv.prepare({ status: 501, message: `Contact Files Uploads Failed !`, data: {} });
                                            objv.execute();
                                        }
                                    });
                                });
                            });

                        })
                    } else if (newValue.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || newValue.mimetype == 'application/vnd.ms-excel') {
                        var uploaddir = new UploadDirectory();
                        let fname = "cfile" + (new Date().getTime()) + '.csv';
                        let fpath = uploaddir.UPLOADSDIR;
                        let size = (((newValue.size) / 1024) / 1024).toFixed(3);
                        const workbook = XLSX.readFile(newValue.path);
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        const csvWriter = createCsvWriter({
                            path: fpath + fname,
                            header: jsonData[0].map((header: any) => ({ id: header, title: header })),
                        });
                        const records = jsonData.slice(1).map((record: any) =>
                            jsonData[0].reduce((obj: { [x: string]: any; }, header: string | number, index: string | number) => {
                                obj[header] = record[index];
                                return obj;
                            }, {})
                        );

                        csvWriter.writeRecords(records)
                            .then(() => {
                                let obja = new ModelRawNonQuery(req, res);
                                obja.nonqrysql = `INSERT INTO cel_uploads_contact(iduser, filename, file_type, filepath, size) VALUES ("${sessdata.id}","${newValue.originalname}", "${req.body.type}", "${fpath}", ${size})`;
                                obja.prepare();
                                obja.execute((error: any, result: any) => {
                                    let lastid = result.insertId;
                                    let obj = new ModelRawNonQuery(req, res);
                                    obj.nonqrysql = "LOAD DATA LOCAL INFILE  '" + fpath + fname + "' INTO TABLE cel_leads  FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (@cal1,@cal2,@cal3,@cal4,@cal5,@cal6,@cal7,@cal8,@cal9,@cal10,@cal11,@cal12) SET phone_no=@cal1, first_name=@cal2, last_name=@cal3, address1=@cal4, address2=@cal5, city=@cal6, state=@cal7, pincode=@cal8, branch_name=@cal9, representative_name=@cal10, iduser = '" + sessdata.id + "', upload_id='" + lastid + "'";
                                    obj.prepare();
                                    obj.execute((error: number, result: any) => {
                                        let objd = new ModelRawQuery(req, res);
                                        objd.qrysql = "SELECT COUNT(upload_id)`total` FROM cel_leads WHERE upload_id = '" + lastid + "'";
                                        objd.prepare();
                                        objd.execute((error: any, resultss: any) => {
                                            console.log("count:::", resultss)
                                            let totalcount = resultss[0].total
                                            let obj = new ModelRawNonQuery(req, res);
                                            obj.nonqrysql = "UPDATE `cel_uploads_contact` SET `total_count`= '" + totalcount + "' WHERE id = '" + lastid + "'";
                                            obj.prepare();
                                            obj.execute((error: any, result: any) => {
                                                if (error == 1) {
                                                    let objv = new RawView(res);
                                                    objv.prepare({ status: 200, message: `Contact File Uploaded Successfully!`, data: { id: lastid, filename: newValue.originalname } });
                                                    objv.execute();
                                                }
                                                else {
                                                    let objv = new RawView(res);
                                                    objv.prepare({ status: 501, message: `Contact Files Uploads Failed !`, data: {} });
                                                    objv.execute();
                                                }
                                            });
                                        });
                                    });

                                })
                            })
                            .catch((error: any) => {
                                let objv = new RawView(res);
                                objv.prepare({ status: 500, message: "Something went wrong" });
                                objv.execute();
                            });

                    } else {
                        let objv = new RawView(res);
                        objv.prepare({ status: 502, message: "This file type not acceptable , Acceptable file types are (xls,csv,txt)!" });
                        objv.execute();
                    }
                }
                else {
                    let objv = new Res406(res);
                    objv.prepare({ status: 401, message: "Invalid Authentication!" });
                    objv.execute();
                }
            });
        }
    }

    public uploadBlockList(req: Request, res: Response, next: NextFunction) {
        if (req.body.filename == '') {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "CSV file Not Found!" });
            objv.execute();
        } else {
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: number, sessdata: any) => {
                let objfile = new ModelCsvUpload(req, res);
                let fdata: any = objfile.fileUpload();
                let size = (fdata[3] / 1024 / 1024).toFixed(3);
                let obja = new ModelRawNonQuery(req, res);
                obja.nonqrysql = `INSERT INTO cel_uploads_block(iduser, filename, file_type, filepath, size) VALUES ("${sessdata.id}","${fdata[0]}", "${req.body.type}", "${fdata[1]}", ${size})`;
                obja.prepare();
                obja.execute((error: any, result: any) => {
                    if (error == 1) {
                        let lastid = result.insertId;
                        let obj = new ModelRawNonQuery(req, res)
                        obj.nonqrysql = "LOAD DATA LOCAL INFILE  '" + fdata[1] + fdata[0] + "' INTO TABLE cel_blockleads  FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (@cal1,@cal2,@cal3) SET phone_no=@cal1, iduser = '" + sessdata.id + "', upload_id='" + lastid + "'";
                        obj.prepare();
                        obj.execute((error: number, result: any) => {
                            let objd = new ModelRawQuery(req, res);
                            objd.qrysql = "SELECT COUNT(upload_id)`total` FROM cel_blockleads WHERE upload_id = '" + lastid + "'";
                            objd.prepare();
                            objd.execute((error: any, resultss: any) => {
                                if (error == 1 && resultss.length > 0) {
                                    let obj = new ModelRawNonQuery(req, res);
                                    obj.nonqrysql = "UPDATE `cel_uploads_block` SET `total_count`= '" + resultss[0].total + "' WHERE id = '" + lastid + "'";
                                    obj.prepare();
                                    obj.execute((error: any, result: any) => {
                                        let objv = new RawView(res);
                                        objv.prepare({ status: 200, message: "Block List uploaded", data: { id: lastid, filename: fdata[0] } });
                                        objv.execute();
                                    });
                                }
                                else {
                                    let objv = new RawView(res);
                                    objv.prepare({ status: 501, message: "Block file Uploads Failed" });
                                    objv.execute();
                                }
                            });
                        });
                    }
                    else {
                        let objv = new RawView(res);
                        objv.prepare({ status: 502, message: "Block file Uploads Failed" });
                        objv.execute();
                    }
                });
            });
        }
    }

    public uploadVoiceFile(req: Request, res: Response, next: NextFunction) {
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: number, sessdata: any) => {
            if (error == 1) {
                let objfile = new ModelOtherUpload(req, res);
                let fdata: any = objfile.AudioUpload();
                let size = (fdata[3] / 1024 / 1024).toFixed(3);
                let obj = new ModelRawNonQuery(req, res);
                obj.nonqrysql = `INSERT INTO cel_uploads_voice(iduser,filename, file_type, filepath, size, audio) VALUES ("${sessdata.id}","${fdata[0]}", "${req.body.type}", "${fdata[1]}", ${size}, "${fdata[4]}")`;
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    if (error == 1 && result) {
                        let objv = new RawView(res);
                        objv.prepare({ status: 200, message: "Audio file uploaded Successfully", data: { id: result.insertId, filename: fdata[0] } });
                        objv.execute();
                    }
                    else {
                        let objv = new RawView(res);
                        objv.prepare({ status: 501, message: "Audio file Uploads Failed " });
                        objv.execute();
                    }
                });
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ status: 401, message: "Invalid Authentication!" });
                objv.execute();
            }
        });
    }

    //delete contact
    public deteteContact(req: Request, res: Response, next: NextFunction) {
        if (req.query.id != "") {
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: any, sessdata: any) => {
                if (error == 1) {
                    let obj = new ModelRawNonQuery(req, res);
                    obj.nonqrysql = "UPDATE `cel_uploads_contact` SET `is_deleted`=1 WHERE `id`='" + req.query.id + "' AND `iduser` = '" + sessdata.id + "'";
                    obj.prepare();
                    obj.execute((error: any, result: any) => {
                        if (error == 1 && result.affectedRows == 1) {
                            let objv = new RawView(res);
                            objv.prepare({ status: 200, message: "Contact File Deleted Successfully" });
                            objv.execute();
                        } else {
                            let objv = new RawView(res);
                            objv.prepare({ status: 404, message: "Data Not Found!" });
                            objv.execute();
                        }
                    });
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 401, message: "Invalid Authentication!" });
                    objv.execute();
                }
            });
        }
        else {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }

    }

    //delete block file
    public deteteBlock(req: Request, res: Response, next: NextFunction) {
        if (req.query.id != "") {
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: any, sessdata: any) => {
                if (error == 1) {
                    let obj = new ModelRawNonQuery(req, res);
                    obj.nonqrysql = "UPDATE `cel_uploads_block` SET `is_deleted`=1 WHERE `id`='" + req.query.id + "' AND `iduser` = '" + sessdata.id + "'";
                    obj.prepare();
                    obj.execute((error: any, result: any) => {
                        if (error == 1 && result.affectedRows == 1) {
                            let objv = new RawView(res);
                            objv.prepare({ status: 200, message: "BLock File Deleted Successfully" });
                            objv.execute();
                        } else {
                            let objv = new RawView(res);
                            objv.prepare({ status: 404, message: "Data Not Found!" });
                            objv.execute();
                        }
                    })
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 401, message: "Invalid Authentication!" });
                    objv.execute();
                }
            });
        }
        else {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }
    }

    //Start Camapign
    public startCampaign(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body;
        if (sdata.id_campaign != null) {
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: number, sessdata: any) => {
                if (error == 1) {
                    let obj = new ModelRawQuery(req, res);
                    obj.qrysql = "SELECT  `contact_file_id`, `voice_file_id` FROM `cel_campaigns` WHERE iduser = '" + sessdata.id + "' AND `id`= '" + sdata.id_campaign + "'";
                    obj.prepare();
                    obj.execute((error: any, result: any) => {
                        if (error == 1 && result.length > 0) {
                            let objss = new ModelRawQuery(req, res);
                            objss.qrysql = "SELECT  COUNT(*)`leads` FROM `cel_leads` WHERE `status`=0 AND `upload_id` = '" + result[0].contact_file_id + "'";
                            objss.prepare();
                            objss.execute((error: any, leads: any) => {
                                if (error == 1 && leads.length > 0) {
                                    let objs = new ModelRawQuery(req, res);
                                    objs.qrysql = "UPDATE cel_campaigns SET `status`= 2 WHERE  `id` = '" + sdata.id_campaign + "'";
                                    objs.prepare();
                                    objs.execute((error: any, resultss: any) => {
                                        if (error == 1 && resultss.affectedRows == 1) {
                                            let objv = new RawView(res);
                                            objv.prepare({ status: 200, message: "Campaign started successfully", data: { id_campaign: sdata.id_campaign } });
                                            objv.execute();
                                        } else {
                                            let objv = new RawView(res);
                                            objv.prepare({ status: 501, message: "Campaign start failed!" });
                                            objv.execute();
                                        }
                                    });
                                }
                                else {
                                    let objv = new RawView(res);
                                    objv.prepare({ status: 403, message: "Contacts not avaialble!" });
                                    objv.execute();
                                }
                            });
                        }
                        else {
                            let objv = new RawView(res);
                            objv.prepare({ status: 404, message: "No Campaign Found!" });
                            objv.execute();
                        }
                    });
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 401, message: "Invalid Authentication!" });
                    objv.execute();
                }
            });
        } else {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }
    }

    /**
     * Stop Campaign  
    */
    public stopCampaign(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body;
        if (sdata.id_campaign != null) {
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: number, sessdata: any) => {
                if (error == 1) {
                    let obj = new ModelRawQuery(req, res);
                    obj.qrysql = "UPDATE cel_campaigns SET `status`=3 WHERE `id` = '" + sdata.id_campaign + "'";
                    obj.prepare();
                    obj.execute((error: any, result: any) => {
                        if (error == 1 && result.affectedRows == 1) {
                            let objv = new RawView(res);
                            objv.prepare({ status: 200, message: "Campaign pause successfully", data: { id_campaign: sdata.id_campaign } });
                            objv.execute();
                        } else {
                            let objv = new RawView(res);
                            objv.prepare({ status: 501, message: "Campaign pause failed!" });
                            objv.execute();
                        }
                    });
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 401, message: "Invalid Authentication!" });
                    objv.execute();
                }
            });
        } else {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }
    }

    //create campaign
    public createCapmaign(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body;
        if (sdata.campaign_name != null && sdata.contact_file_id != null && sdata.voice_file_id != null) {
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: number, sessdata: any) => {
                if (error == 1) {
                    let obj = new ModelRawQuery(req, res);
                    obj.qrysql = "SELECT  id, filename FROM `cel_uploads_voice` WHERE `status`=2 AND  iduser = '" + sessdata.id + "' AND `id`= '" + sdata.voice_file_id + "'";
                    obj.prepare();
                    obj.execute((error: any, result: any) => {
                        if (error == 1 && result.length > 0) {
                            let objss = new ModelRawQuery(req, res);
                            objss.qrysql = "SELECT  id, filename FROM `cel_uploads_contact` WHERE `is_deleted`=0 AND  iduser = '" + sessdata.id + "' AND `id`= '" + sdata.contact_file_id + "'";
                            objss.prepare();
                            objss.execute((error: any, leads: any) => {
                                if (error == 1 && leads.length > 0) {
                                    let obj = new ModelRawNonQuery(req, res);
                                    obj.nonqrysql = `INSERT INTO cel_campaigns(iduser,campaign_name, campaign_type, contact_file_id, voice_file_id) VALUES ("${sessdata.id}","${sdata.campaign_name}", "Only Voice", "${sdata.contact_file_id}","${sdata.voice_file_id}")`;
                                    obj.prepare();
                                    obj.execute((error: any, result: any) => {
                                        let lastid = result.insertId;
                                        if (error == 1 && result) {
                                            let objv = new RawView(res);
                                            objv.prepare({ status: 201, message: "Campaign Created Successfully", data: { id_campaign: lastid, campaign_name: sdata.campaign_name } });
                                            objv.execute();
                                        } else {
                                            let objv = new RawView(res);
                                            objv.prepare({ status: 501, message: "Campaign Created Failed" });
                                            objv.execute();
                                        }
                                    });
                                } else {
                                    let objv = new RawView(res);
                                    objv.prepare({ status: 403, message: "Contacts not avaialble!" });
                                    objv.execute();
                                }
                            });
                        } else {
                            let objv = new RawView(res);
                            objv.prepare({ status: 501, message: "Voice File Not Approve !" });
                            objv.execute();
                        }
                    })
                } else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 401, message: "Invalid Authentication!" });
                    objv.execute();
                }
            });
        } else {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }
    }

    //singal number api
    public createCapmaignNumber(req: Request, res: Response, next: NextFunction) {
        let sdata = req.body;
        if (sdata.campaign_name != null && sdata.phone_no != null && sdata.voice_file_id != null) {
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: number, sessdata: any) => {
                if (error == 1) {
                    let obj = new ModelRawQuery(req, res);
                    obj.qrysql = "SELECT  id, filename FROM `cel_uploads_voice` WHERE `status`=2 AND  iduser = '" + sessdata.id + "' AND `id`= '" + sdata.voice_file_id + "'";
                    obj.prepare();
                    obj.execute((error: any, result: any) => {
                        if (error == 1 && result.length > 0) {
                            // let datass = sdata.phone_no.split(",")
                            // for (let index = 0; index < datass.length; index++) {
                            //     const element = datass[index];
                            //     // console.log(element.length)
                            //     if (element.length == 10) {
                            //         console.log("asdfgh", element)
                            let objss = new ModelRawNonQuery(req, res);
                            objss.nonqrysql = `INSERT INTO cel_campaigns(iduser,campaign_name, campaign_type, voice_file_id) VALUES ("${sessdata.id}","${sdata.campaign_name}", "Only Voice", "${sdata.voice_file_id}")`;
                            objss.prepare();
                            objss.execute((error: any, leads: any) => {
                                if (error == 1 && leads.affectedRows == 1) {
                                    let lastid = leads.insertId;
                                    let data = sdata.phone_no.split(",");
                                    for (let i = 0; i < data.length; i++) {
                                        console.log(data[i])
                                        let objas = new ModelRawNonQuery(req, res)
                                        objas.nonqrysql = "INSERT INTO cel_leads(iduser,campaign_id,phone_no) VALUES ('" + sessdata.id + "','" + lastid + "','" + data[i] + "')";
                                        objas.prepare();
                                        objas.execute((error: number, resultss: any) => { });
                                    }
                                    let objv = new RawView(res);
                                    objv.prepare({ status: 201, message: "Campaign Created Successfully", data: { id_campaign: lastid, campaign_name: sdata.campaign_name } });
                                    objv.execute();
                                } else {
                                    let objv = new RawView(res);
                                    objv.prepare({ status: 501, message: "Campaign Created Failed" });
                                    objv.execute();
                                }
                            });
                            // } else {
                            //     console.log(element)
                            //     let objv = new RawView(res);
                            //     objv.prepare({ status: 501, message: "Please enter number length 10" });
                            //     objv.execute();
                            // }
                            // }
                        } else {
                            let objv = new RawView(res);
                            objv.prepare({ status: 501, message: "Voice File Not Approve !" });
                            objv.execute();
                        }
                    })
                } else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 401, message: "Invalid Authentication!" });
                    objv.execute();
                }
            });
        } else {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }
    }


    //All campaign data
    public getCampaignData(req: Request, res: Response, next: NextFunction) {
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: number, sessdata: any) => {
            if (error == 1) {
                let obj = new ModelRawQuery(req, res);
                // obj.qrysql = "SELECT a.id, a.`campaign_name`, a.`campaign_type`, b.`totallead` `total_no`, b.`answer` `answered`, b.`failed`, b.`busy`, a.`status`,DATE_FORMAT(a.`created_at`,'%d-%m-%Y')`date`, a.retryType FROM `cel_campaigns` a LEFT JOIN `cel_campaign_log` b ON a.`id`=b.`id_campaign` WHERE a.`iduser` = '" + sessdata.id + "' ORDER BY a.`id` DESC";
                obj.qrysql = "SELECT id, campaign_name, campaign_type,status,CASE WHEN `status`='1' THEN 'Scheduled' WHEN `status` ='2'  THEN 'Running'  WHEN `status` ='3'  THEN 'Pause'  WHEN `status` ='4'  THEN 'Completed' ELSE 'Scheduled' END AS status FROM `cel_campaigns` WHERE iduser = '" + sessdata.id + "' ORDER BY id DESC";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    if (error == 1 && result.length > 0) {
                        let objv = new RawView(res);
                        objv.prepare({ status: 200, message: "Campaign List Fetch Successfully", data: result });
                        objv.execute();
                    }
                    else {
                        let objv = new RawView(res);
                        objv.prepare({ status: 404, message: "No records found!" });
                        objv.execute();
                    }
                });
            }
            else {
                let objv = new RawView(res);
                objv.prepare({ status: 401, message: "No session data there" });
                objv.execute();
            }
        });

    }


    public getCampaignlist(req: Request, res: Response, next: NextFunction) {
        if (req.body.campaign_id != "") {
            let campid = req.body
            console.log("campainhhh", campid)
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: number, sessdata: any) => {
                if (error == 1) {
                    let obj = new ModelRawQuery(req, res);
                    obj.qrysql = "SELECT c.`id`, c.campaign_name, c.total_no, c.valid_no, c.invalid_no, c.total_dialed, c.call_patch,c.status, c.answered, c.unanswered, c.busy,c.start_date, c.end_date,p.cost, CASE WHEN `status`='1' THEN 'Scheduled' WHEN c.`status` ='2'  THEN 'Running'  WHEN c.`status` ='3'  THEN 'Pause'  WHEN c.`status` ='4'  THEN 'Completed' ELSE 'Scheduled' END AS status FROM `cel_campaigns` c INNER JOIN cel_campaign_passbook p ON c.iduser = p.iduser WHERE c.iduser = '" + sessdata.id + "' AND c.is_deleted = '0' AND c.id='" + campid.campaign_id + "'";
                    obj.prepare();
                    obj.execute((error: any, result: any) => {
                        if (error == 1 && result.length > 0) {
                            let objv = new RawView(res);
                            objv.prepare({ status: 200, message: "Campaign loaded Successfully!", data: result });
                            objv.execute();
                        }
                        else {
                            let objv = new RawView(res);
                            objv.prepare({ status: 404, message: "No records found!" });
                            objv.execute();
                        }
                    });
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 401, message: "No session data there" });
                    objv.execute();
                }
            });
        }
        else {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }

    }

    // else if (type == 'Voice File') {
    public DeletevoiceFile(req: Request, res: Response, next: NextFunction) {
        if (req.body.voice_id != "") {
            let voiceid = req.body
            console.log("PPP", voiceid)
            let session = new SessionManagment(req, res, next);
            session.GetSession((error: number, sessdata: any) => {
                if (error == 1) {
                    let obj = new ModelRawNonQuery(req, res);
                    obj.nonqrysql = "DELETE FROM `cel_uploads_voice` WHERE `id`='" + voiceid.voice_id + "' AND `iduser` = '" + sessdata.id + "' ";
                    obj.prepare();
                    obj.execute((error: any, result: any) => {
                        if (result.affectedRows == 1) {
                            let objv = new RawView(res);
                            objv.prepare({ status: 200, message: "Voice Deleted Successfully" });
                            objv.execute();
                        } else {
                            let objv = new RawView(res);
                            objv.prepare({ status: 404, message: "No records found!" });
                            objv.execute();
                        }
                    });
                }
                else {
                    let objv = new RawView(res);
                    objv.prepare({ status: 401, message: "No session data there" });
                    objv.execute();
                }

            });
        } else {
            let objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }
    }


    public addttsCampaign(req: Request, res: Response, next: NextFunction) {
        const sdata = req.body;
        const datas = JSON.parse(JSON.stringify(sdata.msisdnlist));
        // console.log('length', datas.length)
        // console.log('sdata.serviceno', sdata.serviceno);
        if (
            sdata.ccampid !== undefined && sdata.ccampid !== null && sdata.ccampid !== "" &&
            sdata.ccampname !== undefined && sdata.ccampname !== null && sdata.ccampname !== "" &&
            sdata.sourcetype !== undefined && sdata.sourcetype !== null && sdata.sourcetype !== ""
        ) {
            if (datas.length > 0) {
                const session = new SessionManagment(req, res, next);
                session.GetSession((error: number, sessdata: any) => {
                    if (error == 1) {
                        const obj = new ModelRawQuery(req, res);
                        const checkCcampidQuery = `SELECT COUNT(*) AS count FROM cel_campaigns WHERE id='${sdata.ivrtemplateid}' AND campaign_type='TTS' AND iduser='${sessdata.id}'`;
                        obj.qrysql = checkCcampidQuery;
                        obj.prepare();
                        obj.execute((error: any, resultCcampid: any) => {
                            if (resultCcampid[0].count > 0) {
                                if (sdata.serviceno.length !== 0) {
                                    const objn = new ModelRawQuery(req, res);
                                    objn.qrysql = `SELECT did FROM cel_did WHERE id_campaign='${sdata.ivrtemplateid}'`;;
                                    objn.prepare();
                                    objn.execute((error: any, result: any) => {
                                        const didArray = result.map((row: { did: any; }) => Number(row.did));
                                        const unmatchedData = [];
                                        for (const item of sdata.serviceno) {
                                            if (!didArray.includes(item)) {
                                                unmatchedData.push(item);
                                            }
                                        }
                                        // console.log('Unmatched Data:', unmatchedData);  
                                        if (unmatchedData.length > 0) {
                                            const objv = new RawView(res);
                                            objv.prepare({ status: 409, message: `Wrong Service No. ${unmatchedData}` });
                                            objv.execute();
                                        } else {
                                            const objb = new ModelRawQuery(req, res);
                                            const insertQuery = `INSERT INTO cel_tts(iduser, idaccount, ccampid, ccampname, sourcetype, msisdnlist, serviceno, ivrtemplateid, sendsms, retryatmpt) VALUES ('${sessdata.id}' ,'${sessdata.idaccount}','${sdata.ccampid}','${sdata.ccampname}', '${sdata.sourcetype}', 'json', '${sdata.serviceno}', '${sdata.ivrtemplateid}', '${sdata.sendsms}', '${sdata.retryatmpt}')`;
                                            objb.qrysql = insertQuery;
                                            objb.prepare();
                                            objb.execute((error: any, result: any) => {
                                                if (error == 1) {
                                                    let lastid = result.insertId;
                                                    const data = JSON.parse(JSON.stringify(sdata.msisdnlist));
                                                    const obj = new ModelRawNonQuery(req, res);
                                                    const queries = [];
                                                    for (let i = 0; i < data.length; i++) {
                                                        if (data[i] != "") {
                                                            const query = `INSERT INTO cel_tts_contact (ccampid, param_1, param_2, param_3, param_4, param_5, param_6, param_7, param_8, phone, id_tts, iduser) VALUES ('${sdata.ccampid}', '${data[i].param_1}', '${data[i].param_2}', '${data[i].param_3}', '${data[i].param_4}', '${data[i].param_5}', '${data[i].param_6}', '${data[i].param_7}', '${data[i].param_8}', '${data[i].phone}', '${lastid}', '${sessdata.id}' )`;
                                                            queries.push(query);
                                                        }
                                                    }
                                                    // Execute all queries in a batch
                                                    obj.nonqrysql = queries.join('; '); // Combine queries with semicolons
                                                    obj.prepare();
                                                    obj.execute((error: number, result: any) => { });
                                                }
                                                if (result) {
                                                    const objv = new RawView(res);
                                                    objv.prepare({ status: 201, message: "Data Loaded Successfully", data: { ccampname: sdata.ccampname } });
                                                    objv.execute();
                                                } else {
                                                    const objv = new RawView(res);
                                                    objv.prepare({ status: 500, message: "Something went wrong" });
                                                    objv.execute();
                                                }
                                            });

                                        }
                                    })

                                } else {
                                    const objn = new ModelRawQuery(req, res);
                                    const checkDID = `SELECT did FROM cel_did WHERE id_campaign='${sdata.ivrtemplateid}'`;
                                    objn.qrysql = checkDID;
                                    objn.prepare();
                                    objn.execute((error: any, resultDID: any) => {
                                        const didArray = resultDID.map((row: { did: any; }) => row.did);
                                        console.log('didArray', didArray)
                                        const objb = new ModelRawQuery(req, res);
                                        const insertQuery = `INSERT INTO cel_tts(iduser, idaccount,ccampid, ccampname, sourcetype, msisdnlist, serviceno, ivrtemplateid, sendsms, retryatmpt) VALUES ('${sessdata.id}' ,'${sessdata.idaccount}','${sdata.ccampid}','${sdata.ccampname}', '${sdata.sourcetype}', 'json', '${didArray}', '${sdata.ivrtemplateid}', '${sdata.sendsms}', '${sdata.retryatmpt}')`;
                                        objb.qrysql = insertQuery;
                                        objb.prepare();
                                        objb.execute((error: any, result: any) => {
                                            if (error == 1) {
                                                let lastid = result.insertId;
                                                const data = JSON.parse(JSON.stringify(sdata.msisdnlist));
                                                const obj = new ModelRawNonQuery(req, res);
                                                const queries = [];
                                                for (let i = 0; i < data.length; i++) {
                                                    if (data[i] != "") {
                                                        // Construct the SQL query with values from data[i]
                                                        const query = `INSERT INTO cel_tts_contact (ccampid, param_1, param_2, param_3, param_4, param_5, param_6, param_7, param_8, phone, id_tts, iduser) VALUES ('${sdata.ccampid}', '${data[i].param_1}', '${data[i].param_2}', '${data[i].param_3}', '${data[i].param_4}', '${data[i].param_5}', '${data[i].param_6}', '${data[i].param_7}', '${data[i].param_8}', '${data[i].phone}', '${lastid}', '${sessdata.id}')`;
                                                        queries.push(query);
                                                    }
                                                }
                                                // Execute all queries in a batch
                                                obj.nonqrysql = queries.join('; '); // Combine queries with semicolons
                                                obj.prepare();
                                                obj.execute((error: number, result: any) => { });
                                            }
                                            if (result) {
                                                const objv = new RawView(res);
                                                objv.prepare({ status: 201, message: "Data Loaded Successfully", data: { ccampname: sdata.ccampname } });
                                                objv.execute();
                                            } else {
                                                const objv = new RawView(res);
                                                objv.prepare({ status: 500, message: "Something went wrong" });
                                                objv.execute();
                                            }
                                        })
                                    });
                                }
                            } else {
                                const objv = new RawView(res);
                                objv.prepare({ status: 409, message: "Wrong TTS Campaign ID" });
                                objv.execute();
                            }
                        });
                    } else {
                        const objv = new RawView(res);
                        objv.prepare({ status: 401, message: "No session data there" });
                        objv.execute();
                    }
                });
            } else {
                const objv = new RawView(res);
                objv.prepare({ status: 400, message: "msisdnlist missing!" });
                objv.execute();
            }
        } else {
            const objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }
    }

    public Campaigns(req: Request, res: Response, next: NextFunction) {
        const sdata = req.body;
        const datas = JSON.parse(JSON.stringify(sdata.msisdnlist));
        if (
            sdata.ccampid !== undefined && sdata.ccampid !== null && sdata.ccampid !== "" &&
            sdata.ccampname !== undefined && sdata.ccampname !== null && sdata.ccampname !== "" &&
            sdata.sourcetype !== undefined && sdata.sourcetype !== null && sdata.sourcetype !== ""
        ) {
            if (datas.length > 0) {
                const session = new SessionManagment(req, res, next);
                session.GetSession((error: number, sessdata: any) => {
                    if (error == 1) {
                        if (!sdata.campaigntype) {
                            const obj = new ModelRawQuery(req, res);
                            const checkCcampidQuery = `SELECT COUNT(*) AS count FROM cel_campaigns WHERE id='${sdata.ivrtemplateid}'  AND campaign_type IN ('Only Voice', 'DTMF Capture') AND iduser='${sessdata.id}'`;
                            obj.qrysql = checkCcampidQuery;
                            obj.prepare();
                            obj.execute((error: any, resultCcampid: any) => {
                                if (resultCcampid[0].count > 0) {
                                    if (sdata.serviceno.length !== 0) {
                                        const objn = new ModelRawQuery(req, res);
                                        objn.qrysql = `SELECT did FROM cel_did WHERE id_campaign='${sdata.ivrtemplateid}'`;;
                                        objn.prepare();
                                        objn.execute((error: any, result: any) => {
                                            const didArray = result.map((row: { did: any; }) => Number(row.did));
                                            const unmatchedData = [];
                                            for (const item of sdata.serviceno) {
                                                if (!didArray.includes(item)) {
                                                    unmatchedData.push(item);
                                                }
                                            }
                                            if (unmatchedData.length > 0) {
                                                const objv = new RawView(res);
                                                objv.prepare({ status: 409, message: `Wrong Service No. ${unmatchedData}` });
                                                objv.execute();
                                            } else {
                                                const objb = new ModelRawQuery(req, res);
                                                const insertQuery = `INSERT INTO cel_tts(iduser, idaccount, ccampid, ccampname, sourcetype, msisdnlist, serviceno, ivrtemplateid, sendsms, retryatmpt) VALUES ('${sessdata.id}' ,'${sessdata.idaccount}','${sdata.ccampid}','${sdata.ccampname}', '${sdata.sourcetype}', 'json', '${sdata.serviceno}', '${sdata.ivrtemplateid}', '${sdata.sendsms}', '${sdata.retryatmpt}')`;
                                                objb.qrysql = insertQuery;
                                                objb.prepare();
                                                objb.execute((error: any, result: any) => {
                                                    if (error == 1) {
                                                        let lastid = result.insertId;
                                                        const data = JSON.parse(JSON.stringify(sdata.msisdnlist));
                                                        const obj = new ModelRawNonQuery(req, res);
                                                        const queries = [];
                                                        for (let i = 0; i < data.length; i++) {
                                                            if (data[i] != "") {
                                                                // const query = `INSERT INTO cel_tts_contact (ccampid, phone, id_tts, iduser) VALUES ('${sdata.ccampid}', '${data[i].phone}', '${lastid}', '${sessdata.id}' )`;
                                                                const query = `INSERT INTO cel_leads (campaign_id, phone_no, iduser, api) VALUES ('${sdata.ivrtemplateid}', '${data[i].phone}', '${sessdata.id}' , '${lastid}')`;
                                                                queries.push(query);
                                                            }
                                                        }
                                                        // Execute all queries in a batch
                                                        obj.nonqrysql = queries.join('; '); // Combine queries with semicolons
                                                        obj.prepare();
                                                        obj.execute((error: number, result: any) => { });
                                                    }
                                                    if (result) {
                                                        const objv = new RawView(res);
                                                        objv.prepare({ status: 201, message: "Data Loaded Successfully", data: { ccampname: sdata.ccampname } });
                                                        objv.execute();
                                                    } else {
                                                        const objv = new RawView(res);
                                                        objv.prepare({ status: 500, message: "Something went wrong" });
                                                        objv.execute();
                                                    }
                                                });

                                            }
                                        })

                                    } else {
                                        const objn = new ModelRawQuery(req, res);
                                        const checkDID = `SELECT did FROM cel_did WHERE id_campaign='${sdata.ivrtemplateid}'`;
                                        objn.qrysql = checkDID;
                                        objn.prepare();
                                        objn.execute((error: any, resultDID: any) => {
                                            const didArray = resultDID.map((row: { did: any; }) => row.did);
                                            console.log('didArray', didArray)
                                            const objb = new ModelRawQuery(req, res);
                                            const insertQuery = `INSERT INTO cel_tts(iduser, idaccount,ccampid, ccampname, sourcetype, msisdnlist, serviceno, ivrtemplateid, sendsms, retryatmpt) VALUES ('${sessdata.id}' ,'${sessdata.idaccount}','${sdata.ccampid}','${sdata.ccampname}', '${sdata.sourcetype}', 'json', '${didArray}', '${sdata.ivrtemplateid}', '${sdata.sendsms}', '${sdata.retryatmpt}')`;
                                            objb.qrysql = insertQuery;
                                            objb.prepare();
                                            objb.execute((error: any, result: any) => {
                                                if (error == 1) {
                                                    let lastid = result.insertId;
                                                    const data = JSON.parse(JSON.stringify(sdata.msisdnlist));
                                                    const obj = new ModelRawNonQuery(req, res);
                                                    const queries = [];
                                                    for (let i = 0; i < data.length; i++) {
                                                        if (data[i] != "") {
                                                            // Construct the SQL query with values from data[i]
                                                            const query = `INSERT INTO cel_leads (campaign_id, phone_no, iduser, api) VALUES ('${sdata.ivrtemplateid}', '${data[i].phone}', '${sessdata.id}', '${lastid}' )`;
                                                            queries.push(query);
                                                        }
                                                    }
                                                    // Execute all queries in a batch
                                                    obj.nonqrysql = queries.join('; '); // Combine queries with semicolons
                                                    obj.prepare();
                                                    obj.execute((error: number, result: any) => { });
                                                }
                                                if (result) {
                                                    const objv = new RawView(res);
                                                    objv.prepare({ status: 201, message: "Data Loaded Successfully", data: { ccampname: sdata.ccampname } });
                                                    objv.execute();
                                                } else {
                                                    const objv = new RawView(res);
                                                    objv.prepare({ status: 500, message: "Something went wrong" });
                                                    objv.execute();
                                                }
                                            })
                                        });
                                    }
                                } else {
                                    const objv = new RawView(res);
                                    objv.prepare({ status: 409, message: "Wrong Campaign ID" });
                                    objv.execute();
                                }
                            });
                        }else if (sdata.campaigntype === 'Only Voice' || sdata.campaigntype === 'DTMF Capture') {
                            const obj = new ModelRawQuery(req, res);
                            const checkCcampidQuery = `SELECT COUNT(*) AS count FROM cel_campaigns WHERE id='${sdata.ivrtemplateid}' AND campaign_type='${sdata.campaigntype}' AND iduser='${sessdata.id}'`;
                            obj.qrysql = checkCcampidQuery;
                            obj.prepare();
                            obj.execute((error: any, resultCcampid: any) => {
                                if (resultCcampid[0].count > 0) {
                                    if (sdata.serviceno.length !== 0) {
                                        const objn = new ModelRawQuery(req, res);
                                        objn.qrysql = `SELECT did FROM cel_did WHERE id_campaign='${sdata.ivrtemplateid}'`;;
                                        objn.prepare();
                                        objn.execute((error: any, result: any) => {
                                            const didArray = result.map((row: { did: any; }) => Number(row.did));
                                            const unmatchedData = [];
                                            for (const item of sdata.serviceno) {
                                                if (!didArray.includes(item)) {
                                                    unmatchedData.push(item);
                                                }
                                            }
                                            if (unmatchedData.length > 0) {
                                                const objv = new RawView(res);
                                                objv.prepare({ status: 409, message: `Wrong Service No. ${unmatchedData}` });
                                                objv.execute();
                                            } else {
                                                const objb = new ModelRawQuery(req, res);
                                                const insertQuery = `INSERT INTO cel_tts(iduser, idaccount, ccampid, ccampname, sourcetype,campaigntype, msisdnlist, serviceno, ivrtemplateid, sendsms, retryatmpt) VALUES ('${sessdata.id}' ,'${sessdata.idaccount}','${sdata.ccampid}','${sdata.ccampname}', '${sdata.sourcetype}', '${sdata.campaigntype}', 'json', '${sdata.serviceno}', '${sdata.ivrtemplateid}', '${sdata.sendsms}', '${sdata.retryatmpt}')`;
                                                objb.qrysql = insertQuery;
                                                objb.prepare();
                                                objb.execute((error: any, result: any) => {
                                                    if (error == 1) {
                                                        let lastid = result.insertId;
                                                        const data = JSON.parse(JSON.stringify(sdata.msisdnlist));
                                                        const obj = new ModelRawNonQuery(req, res);
                                                        const queries = [];
                                                        for (let i = 0; i < data.length; i++) {
                                                            if (data[i] != "") {
                                                                const query = `INSERT INTO cel_leads (campaign_id, phone_no, iduser, api) VALUES ('${sdata.ivrtemplateid}', '${data[i].phone}', '${sessdata.id}' , '${lastid}')`;
                                                                queries.push(query);
                                                            }
                                                        }
                                                        // Execute all queries in a batch
                                                        obj.nonqrysql = queries.join('; '); // Combine queries with semicolons
                                                        obj.prepare();
                                                        obj.execute((error: number, result: any) => { });
                                                    }
                                                    if (result) {
                                                        const objv = new RawView(res);
                                                        objv.prepare({ status: 201, message: "Data Loaded Successfully", data: { ccampname: sdata.ccampname } });
                                                        objv.execute();
                                                    } else {
                                                        const objv = new RawView(res);
                                                        objv.prepare({ status: 500, message: "Something went wrong" });
                                                        objv.execute();
                                                    }
                                                });

                                            }
                                        })

                                    } else {
                                        const objn = new ModelRawQuery(req, res);
                                        const checkDID = `SELECT did FROM cel_did WHERE id_campaign='${sdata.ivrtemplateid}'`;
                                        objn.qrysql = checkDID;
                                        objn.prepare();
                                        objn.execute((error: any, resultDID: any) => {
                                            const didArray = resultDID.map((row: { did: any; }) => row.did);
                                            console.log('didArray', didArray)
                                            const objb = new ModelRawQuery(req, res);
                                            const insertQuery = `INSERT INTO cel_tts(iduser, idaccount, ccampid, ccampname, sourcetype,campaigntype, msisdnlist, serviceno, ivrtemplateid, sendsms, retryatmpt) VALUES ('${sessdata.id}' ,'${sessdata.idaccount}','${sdata.ccampid}','${sdata.ccampname}', '${sdata.sourcetype}', '${sdata.campaigntype}', 'json', '${didArray}', '${sdata.ivrtemplateid}', '${sdata.sendsms}', '${sdata.retryatmpt}')`;
                                            objb.qrysql = insertQuery;
                                            objb.prepare();
                                            objb.execute((error: any, result: any) => {
                                                if (error == 1) {
                                                    let lastid = result.insertId;
                                                    const data = JSON.parse(JSON.stringify(sdata.msisdnlist));
                                                    const obj = new ModelRawNonQuery(req, res);
                                                    const queries = [];
                                                    for (let i = 0; i < data.length; i++) {
                                                        if (data[i] != "") {
                                                            // Construct the SQL query with values from data[i]
                                                            const query = `INSERT INTO cel_leads (campaign_id, phone_no, iduser, api) VALUES ('${sdata.ivrtemplateid}', '${data[i].phone}', '${sessdata.id}', '${lastid}' )`;
                                                            queries.push(query);
                                                        }
                                                    }
                                                    // Execute all queries in a batch
                                                    obj.nonqrysql = queries.join('; '); // Combine queries with semicolons
                                                    obj.prepare();
                                                    obj.execute((error: number, result: any) => { });
                                                }
                                                if (result) {
                                                    const objv = new RawView(res);
                                                    objv.prepare({ status: 201, message: "Data Loaded Successfully", data: { ccampname: sdata.ccampname } });
                                                    objv.execute();
                                                } else {
                                                    const objv = new RawView(res);
                                                    objv.prepare({ status: 500, message: "Something went wrong" });
                                                    objv.execute();
                                                }
                                            })
                                        });
                                    }
                                } else {
                                    const objv = new RawView(res);
                                    objv.prepare({ status: 409, message: `Wrong '${sdata.campaigntype}' Campaign ID` });
                                    objv.execute();
                                }
                            });
                        }else{
                            const objv = new RawView(res);
                            objv.prepare({ status: 401, message: "Wrong Campaign ID" });
                            objv.execute();
                        }

                    } else {
                        const objv = new RawView(res);
                        objv.prepare({ status: 401, message: "No session data there" });
                        objv.execute();
                    }
                });
            } else {
                const objv = new RawView(res);
                objv.prepare({ status: 400, message: "msisdnlist missing!" });
                objv.execute();
            }
        } else {
            const objv = new RawView(res);
            objv.prepare({ status: 400, message: "Parameter missing!" });
            objv.execute();
        }
   }



}