import { Request, Response, NextFunction } from "express";
import { RawView } from "../view/RawView";
import { ModelRawNonQuery } from "./RawNonQuery";
import { SessionManagment } from "./Session";
import { Res406 } from "../view/406";
import { Res404 } from "../view/404";
import fs from "fs";
import { PhpReport } from "./PhpReport";
import { Exec } from "./ExecExecute";

export class CreateXml {
    constructor(public data?: any, public campid?: any) { }

    public create(req: Request, res: Response, next: NextFunction) {
        console.log('tushar::++++:::');

        console.log(this.data);
        var sdata = this.data;
        let session = new SessionManagment(req, res, next);
        session.GetSession((error: any, sessdata: any) => {
            let obj = new ModelRawNonQuery(req, res);

            if (sdata.action1 == 'transfer_agent') {
                let respo = sdata.values1.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values1 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {
                            console.log("Agents were mapped into Tiers table.");

                            var xml = "\t\t<queue name=\"" + sdata.values1 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values1 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }


            if (sdata.action2 == 'transfer_agent') {
                let respo = sdata.values2.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values2 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {


                            var xml = "\t\t<queue name=\"" + sdata.values2 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values2 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }


            if (sdata.action3 == 'transfer_agent') {
                let respo = sdata.values3.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values3 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {

                            var xml = "\t\t<queue name=\"" + sdata.values3 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values3 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action4 == 'transfer_agent') {
                let respo = sdata.values4.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values4 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {


                            var xml = "\t\t<queue name=\"" + sdata.values4 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values4 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action5 == 'transfer_agent') {
                let respo = sdata.values5.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values5 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {


                            var xml = "\t\t<queue name=\"" + sdata.values5 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values5 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action6 == 'transfer_agent') {
                let respo = sdata.values6.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values6 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {

                            var xml = "\t\t<queue name=\"" + sdata.values6 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values6 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action7 == 'transfer_agent') {
                let respo = sdata.values7.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values7 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {


                            var xml = "\t\t<queue name=\"" + sdata.values7 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values7 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action8 == 'transfer_agent') {
                let respo = sdata.values8.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values8 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action8 == 'transfer_agent') {
                let respo = sdata.values8.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values8 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {
                            console.log("Agents were mapped into Tiers table.");

                            var xml = "\t\t<queue name=\"" + sdata.values8 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values8 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action9 == 'transfer_agent') {
                let respo = sdata.values9.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values9 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {


                            var xml = "\t\t<queue name=\"" + sdata.values9 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values9 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action10 == 'transfer_agent') {
                let respo = sdata.values10.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values10 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {


                            var xml = "\t\t<queue name=\"" + sdata.values10 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values10 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action11 == 'transfer_agent') {
                let respo = sdata.values11.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values11 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {


                            var xml = "\t\t<queue name=\"" + sdata.values11 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values11 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }

            if (sdata.action12 == 'transfer_agent') {
                let respo = sdata.values12.split("_");
                sdata.agentgroupid = respo[1];


                obj.nonqrysql = "SELECT  `id`,`username` FROM `agents` WHERE agentgroupid=" + sdata.agentgroupid + "";
                obj.prepare();
                obj.execute((error: any, result: any) => {
                    console.log(result.length);
                    console.log(result[0]);
                    console.log(result[1]);
                    var adata = result;
                    if (adata !== undefined && adata.length > 0) {
                        let ssttrr = '';
                        for (let i = 0; i < adata.length; i++) {
                            ssttrr += "('" + sdata.values12 + "','" + adata[i].username + "','" + sessdata.id + "','Ready'," + this.campid + "," + adata[i].id + "),";
                        }
                        ssttrr = ssttrr.replace(/,\s*$/, "");
                        obj.nonqrysql = "INSERT INTO `tiers`(`queue`,`agent`,`iduser`,`state`,`id_campaign`,`idagent`) VALUES " + ssttrr + "";
                        obj.prepare();
                        obj.execute((error: any, result: any) => {

                            var xml = "\t\t<queue name=\"" + sdata.values12 + "\">\n";
                            xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
                            xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
                            xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
                            xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
                            xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
                            xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
                            xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
                            xml += "\t\t</queue>\n";


                            // let uploaddir = new UploadDirectory();
                            let pathupload = '/usr/local/freeswitch/conf/callcenter/';
                            // console.log(uploaddir.UPLOADPATH+'.xml');
                            fs.writeFile(pathupload + sdata.values12 + 'camp' + '.xml', xml, function (err) {
                                console.log("************** fs writeFile **************");
                                console.log(err);

                                if (err) throw err;
                                else {
                                    console.log("************** fs cli exec **************");
                                    if (err) throw err;
                                    else {
                                        let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                                        let objexec = new Exec();

                                        console.log(reportfile);
                                        objexec.execute(reportfile, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'reload mod_callcenter'";

                                        let oexec = new Exec();

                                        console.log(reportpath);
                                        oexec.execute(reportpath, (result: any) => {
                                            console.log('tushar::::::::' + result);
                                            console.log(result);
                                        })

                                        console.log("************** fs cli exec **************");
                                        // 			let objv= new RawView(res);        
                                        // objv.prepare({message:"Xml has been genrated."});
                                        // objv.execute();
                                    }
                                }

                            });
                            console.log("Agents were mapped into Tiers table.");
                        });
                    } else {
                        console.log("No Agents were Selected.");
                    }
                });
            }


        })
    }

    // It will generate the XML file for Agent Group
    public xmlgenration(queuename: any) {
        let reportfile = "/bin/mkdir -p /var/www/html/recording/" + queuename + "";
        let objexec = new Exec();

        console.log(reportfile);
        objexec.execute(reportfile, (result: any) => {
            console.log("result::", result);
        })

        var xml = "\t\t<queue name=\"" + queuename + "\">\n";
        xml += "\t\t\t<param name=\"strategy\" value=\"round-robin\"/>\n";
        xml += "\t\t\t<param name=\"moh-sound\" value=\"\$\${hold_music}\" />\n";
        xml += "\t\t\t<param name=\"time-base-score\" value=\"system\" />\n";
        xml += "\t\t\t<param name=\"max-wait-time\" value=\"60\" />\n";
        xml += "\t\t\t<param name=\"max-wait-time-with-no-agent\" value=\"60\" />\n";
        xml += "\t\t\t<param name=\"max-wait-time-with-no-agent-time-reached\" value=\"5\" />\n";
        xml += "\t\t\t<param name=\"tier-rules-apply\" value=\"false\" />\n";
        xml += "\t\t\t<param name=\"tier-rule-wait-second\" value=\"300\" />\n";
        xml += "\t\t\t<param name=\"tier-rule-wait-multiply-level\" value=\"true\" />\n";
        xml += "\t\t\t<param name=\"tier-rule-no-agent-no-wait\" value=\"false\" />\n";
        xml += "\t\t\t<param name=\"discard-abandoned-after\" value=\"60\" />\n";
        xml += "\t\t\t<param name=\"abandoned-resume-allowed\" value=\"false\" />\n";
        xml += "\t\t\t<param name=\"record-template\" value=\'/var/www/html/recording/" + queuename + "/${strftime(%Y-%m-%d-%H-%M-%S)}.${presence_id}.${lead_id}.${destination_number}.${caller_id_number}.${uuid}.wav\' />\n";
        xml += "\t\t</queue>\n";

        // let uploaddir = new UploadDirectory();
        let pathupload = '/usr/local/freeswitch/conf/callcenter/';
        // let pathupload = '/var/www/html/nexcon/trunk/node/uploads/';                  

        // console.log(uploaddir.UPLOADPATH+'.xml');
        fs.writeFile(pathupload + queuename + 'camp' + '.xml', xml, function (err) {
            console.log("************** fs writeFile **************");
            console.log(err);

            if (err) throw err;
            else {
                console.log("************** start-fs cli exec **************");
                if (err) throw err;
                else {
                    let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
                    let objexec = new Exec();

                    console.log(reportfile);
                    objexec.execute(reportfile, (result: any) => {
                        console.log("result::", result);
                    })

                    let reportpath: any = "/usr/local/freeswitch/bin/fs_cli -x " + "'callcenter_config queue load " + queuename + "'";

                    let oexec = new Exec();

                    console.log(reportpath);
                    oexec.execute(reportpath, (result: any) => {
                        console.log("result::", result);
                    })
                }
                console.log("************** end-fs cli exec **************");
            }
        });
        console.log("Agents were mapped into Tiers table.");
    }
}