import { Request, Response, NextFunction } from "express";
import { ModelCsvUpload } from "../lib/model/ModelCsvUpload";
import { ModelOtherUpload } from "../lib/model/ModelOthersUpload";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";
import { UploadDirectory } from "../config/setting.config";
import { Res404 } from "../lib/view/404";
import { json } from "body-parser";
var XLSX = require('xlsx');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


export class Campaign {

	constructor() { }

	public getCamapignID(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = 'SELECT AUTO_INCREMENT `id` FROM information_schema.TABLES WHERE TABLE_SCHEMA = "celetel_prod_copy" AND TABLE_NAME = "cel_campaigns"';
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (error == 1 && result.length > 0) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Campaign ID Fetched Successfully!", campid: result[0].id });
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
				let objv = new Res406(res);
				objv.prepare({ status: 401, message: "Invalid Authentication!" });
				objv.execute();
			}
		});

	}

	public saveCampaign(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		let dtmfdata = sdata.dtmfAry;
		let did = sdata.did;
		console.log(req.body.data, did);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				const sd = sdata.startdate;
				const se = sdata.enddate;
				// Extract the hour and minute components from the date strings
				const startDate = new Date(sd);
				const endDate = new Date(se);

				const startHour = startDate.getHours();
				const startMinute = startDate.getMinutes();
				const endHour = endDate.getHours();
				const endMinute = endDate.getMinutes();
				if (
					(startHour === 9 && startMinute === 0) && // Exactly 9:00 AM
					(endHour === 21 && endMinute === 0) // Exactly 9:00 PM
				) {
					let obj = new ModelRawNonQuery(req, res);
					obj.nonqrysql = `INSERT INTO cel_campaigns(iduser,campaign_name, campaign_type,retryType, contact_file_id, blacklist_file_id, voice_file_id, retry, dnd_check, duplicate_check, welcome_id, onhold_id, busy_id, voicemail_id, cyclenumber, cycanswered, cycunanswered, cycbusy, cycfailed, test_number, regular_minutes, regular_no, unanswered_minutes, unanswered_minutes_no, busy_minutes, busy_minutes_no, failed_minutes, failed_minutes_no, contact_file_checked, retry_type, start_date, end_date, send_sms, template_id, idaccount,id_plan, introduction, message, thankyou) VALUES ('${sessdata.id}','${sdata.campaignname}', '${sdata.campaigntype}','${sdata.retryType}', '${sdata.contactfile}','${sdata.blacklistfile}','${sdata.voicefile}', '${sdata.retry}', '${sdata.dnd}' ,'${sdata.duplicate}', '${sdata.welcomeid}', '${sdata.onholdid}', '${sdata.busyid}', '${sdata.voiceemailid}', '${sdata.cyclic}', '${sdata.cycanswered}','${sdata.cycunanswered}','${sdata.cycbusy}','${sdata.cycfailed}','${sdata.contactnumber}', '${sdata.regularminutes}','${sdata.regularno}','${sdata.unansweredminutes}','${sdata.unansweredminutesno}','${sdata.busyminutes}','${sdata.busyminutesno}','${sdata.failedminutes}','${sdata.failedminutesno}', '${sdata.contactfilechecked}', '${sdata.retry_type}', '${sdata.startdate}', '${sdata.enddate}', ${sdata.send_sms}, '${sdata.template_id}','${sessdata.idaccount}','${sessdata.plan}','${sdata.introduction}','${sdata.message}','${sdata.thankyou}')`;

					obj.prepare();
					obj.execute((error: any, result: any) => {
						if (error == 1) {

							let lastid = result.insertId;
							let objvt = new ModelRawNonQuery(req, res)
							objvt.nonqrysql = `UPDATE cel_uploads_voice SET campaign_id='${lastid}', voice_map = '1' WHERE id="${sdata.voicefile}"`;
							objvt.prepare();
							objvt.execute((error: number, result: any) => { });

							if (!sdata.contactfilechecked) {
								let obj = new ModelRawNonQuery(req, res);
								let data = sdata.contactsource.split(",");
								for (let i = 0; i < data.length; i++) {
									if (data[i] != "") {
										obj.nonqrysql = "INSERT INTO cel_leads(iduser,campaign_id,phone_no) VALUES ('" + sessdata.id + "','" + lastid + "','" + data[i] + "')";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}

								// obj.nonqrysql = "INSERT INTO cel_uploads_voice(iduser,campaign_id,enter_text,file_type) VALUES ('" + sessdata.id + "','" + lastid + "','" + sdata.enter_text + "','text_file')";
								// obj.prepare();
								// obj.execute((error: number, result: any) => { });

							} else {
								let obju = new ModelRawNonQuery(req, res)
								obju.nonqrysql = `UPDATE cel_uploads_contact SET campaign_id='${lastid}', leads_map = '1' WHERE id="${sdata.contactfile}"`;
								obju.prepare();
								obju.execute((error: number, result: any) => { });



								let objM = new ModelRawNonQuery(req, res)
								objM.nonqrysql = `UPDATE cel_leads SET campaign_id='${lastid}', status=0 WHERE upload_id ="${sdata.contactfile}"`;
								objM.prepare();
								objM.execute((error: number, result: any) => { });
							}

							if (sdata.campaigntype == 'Voice Transfer' || sdata.campaigntype == 'DTMF Capture' || sdata.campaigntype == 'TTS') {
								for (let i = 0; i < dtmfdata.length; i++) {
									let obj = new ModelRawNonQuery(req, res)
									if (dtmfdata[i].dtmftype == '1') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `audio`, `filepath` FROM `cel_uploads_dtmf` WHERE id=" + dtmfdata[i].dtmffile;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].dtmffile + ",'" + gname[0].filepath + gname[0].audio + " ')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '2') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `groupname` FROM `cel_groups` WHERE id=" + dtmfdata[i].executivesgroup;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].executivesgroup + ",'" + gname[0].groupname + "')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '3') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `template_id` FROM `cel_sms` WHERE id=" + dtmfdata[i].template_id;
										obj1.prepare();
										obj1.execute((error: any, tmp: any) => {
											if (error == 1 && tmp.length > 0) {
												obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].template_id + ",'" + tmp[0].template_id + "')";
												obj.prepare();
												obj.execute((error: number, result: any) => { });
											}
										});
									}
									else {
										obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", -1, -1)";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}
							}

							if (did.length > 0) {
								let didary: any = [];
								let count: number = 0;
								for (let i = 0; i < did.length; i++) {
									didary.push(did[i].did.toString());
									count++;
								}
								if (count == did.length) {
									let objM = new ModelRawNonQuery(req, res)
									objM.nonqrysql = "UPDATE `cel_did` SET `id_campaign`=" + lastid + " WHERE `did` IN (" + didary + ")";
									objM.prepare();
									objM.execute((error: number, result: any) => { });
								}
							}

							let objv = new RawView(res);
							objv.prepare({ status: 200, message: "Campaign Created Successfully!", data: result });
							objv.execute();


							//call in SP...
							let osvm = new ModelRawNonQuery(req, res);
							osvm.nonqrysql = "CALL process_dnc('" + sessdata.id + "','" +  lastid + "')";
							osvm.prepare();
							osvm.execute((error:number, result:any)=>{});
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ status: 502, message: "Something went wrong" });
							objv.execute();
						}
					});


					//call in SP...
					let osvm = new ModelRawNonQuery(req, res);
					osvm.nonqrysql = "CALL process_dnc('" + sdata.id + "','" + sessdata.id + "')"
				} else if (
					(startHour > 9 || (startHour === 9 && startMinute >= 0)) && // After 9:00 AM
					(endHour < 21 || (endHour === 21 && endMinute <= 0)) // Before 9:00 PM
				) {
					let obj = new ModelRawNonQuery(req, res);
					obj.nonqrysql = `INSERT INTO cel_campaigns(iduser,campaign_name, campaign_type,retryType, contact_file_id, blacklist_file_id, voice_file_id, retry, dnd_check, duplicate_check, welcome_id, onhold_id, busy_id, voicemail_id, cyclenumber, cycanswered, cycunanswered, cycbusy, cycfailed, test_number, regular_minutes, regular_no, unanswered_minutes, unanswered_minutes_no, busy_minutes, busy_minutes_no, failed_minutes, failed_minutes_no, contact_file_checked, retry_type, start_date, end_date, send_sms, template_id, idaccount,id_plan, introduction, message, thankyou, enter_text) VALUES ('${sessdata.id}','${sdata.campaignname}', '${sdata.campaigntype}','${sdata.retryType}', '${sdata.contactfile}','${sdata.blacklistfile}','${sdata.voicefile}', '${sdata.retry}', '${sdata.dnd}' ,'${sdata.duplicate}', '${sdata.welcomeid}', '${sdata.onholdid}', '${sdata.busyid}', '${sdata.voiceemailid}', '${sdata.cyclic}', '${sdata.cycanswered}','${sdata.cycunanswered}','${sdata.cycbusy}','${sdata.cycfailed}','${sdata.contactnumber}', '${sdata.regularminutes}','${sdata.regularno}','${sdata.unansweredminutes}','${sdata.unansweredminutesno}','${sdata.busyminutes}','${sdata.busyminutesno}','${sdata.failedminutes}','${sdata.failedminutesno}', '${sdata.contactfilechecked}', '${sdata.retry_type}', '${sdata.startdate}', '${sdata.enddate}', ${sdata.send_sms}, '${sdata.template_id}','${sessdata.idaccount}','${sessdata.plan}','${sdata.introduction}','${sdata.message}','${sdata.thankyou}','${sdata.enter_text}')`;

					obj.prepare();
					obj.execute((error: any, result: any) => {
						if (error == 1) {


							let lastid = result.insertId;

							let objvt = new ModelRawNonQuery(req, res)
							objvt.nonqrysql = `UPDATE cel_uploads_voice SET campaign_id='${lastid}', voice_map = '1' WHERE id="${sdata.voicefile}"`;
							objvt.prepare();
							objvt.execute((error: number, result: any) => { });

							if (!sdata.contactfilechecked) {
								let obj = new ModelRawNonQuery(req, res);
								let data = sdata.contactsource.split(",");
								for (let i = 0; i < data.length; i++) {
									if (data[i] != "") {
										obj.nonqrysql = "INSERT INTO cel_leads(iduser,campaign_id,phone_no) VALUES ('" + sessdata.id + "','" + lastid + "','" + data[i] + "')";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}

								// obj.nonqrysql = "INSERT INTO cel_uploads_voice(iduser,campaign_id,enter_text, file_type) VALUES ('" + sessdata.id + "','" + lastid + "','" + sdata.enter_text + "', 'text_file')";
								// obj.prepare();
								// obj.execute((error: number, result: any) => { });
							} else {
								let obju = new ModelRawNonQuery(req, res)
								obju.nonqrysql = `UPDATE cel_uploads_contact SET campaign_id='${lastid}', leads_map = '1' WHERE id="${sdata.contactfile}"`;
								obju.prepare();
								obju.execute((error: number, result: any) => { });

								let objM = new ModelRawNonQuery(req, res)
								objM.nonqrysql = `UPDATE cel_leads SET campaign_id='${lastid}', status=0 WHERE upload_id ="${sdata.contactfile}"`;
								objM.prepare();
								objM.execute((error: number, result: any) => { });
							}

							if (sdata.campaigntype == 'Voice Transfer' || sdata.campaigntype == 'DTMF Capture' || sdata.campaigntype == 'TTS') {
								for (let i = 0; i < dtmfdata.length; i++) {
									let obj = new ModelRawNonQuery(req, res)
									if (dtmfdata[i].dtmftype == '1') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `audio`, `filepath` FROM `cel_uploads_dtmf` WHERE id=" + dtmfdata[i].dtmffile;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].dtmffile + ",'" + gname[0].filepath + gname[0].audio + "')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '2') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `groupname` FROM `cel_groups` WHERE id=" + dtmfdata[i].executivesgroup;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].executivesgroup + ",'" + gname[0].groupname + "')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '3') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `template_id` FROM `cel_sms` WHERE id=" + dtmfdata[i].template_id;
										obj1.prepare();
										obj1.execute((error: any, tmp: any) => {
											if (error == 1 && tmp.length > 0) {
												obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].template_id + ",'" + tmp[0].template_id + "')";
												obj.prepare();
												obj.execute((error: number, result: any) => { });
											}
										});
									}
									else {
										obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", -1, -1)";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}
							}

							if (did.length > 0) {
								let didary: any = [];
								let count: number = 0;
								for (let i = 0; i < did.length; i++) {
									didary.push(did[i].did.toString());
									count++;
								}
								if (count == did.length) {
									let objM = new ModelRawNonQuery(req, res)
									objM.nonqrysql = "UPDATE `cel_did` SET `id_campaign`=" + lastid + " WHERE `did` IN (" + didary + ")";
									objM.prepare();
									objM.execute((error: number, result: any) => { });
								}
							}

							let objv = new RawView(res);
							objv.prepare({ status: 200, message: "Campaign Created Successfully!", data: result });
							objv.execute();


							//call in SP...
							let osvm = new ModelRawNonQuery(req, res);
							osvm.nonqrysql = "CALL process_dnc('" + sessdata.id + "','" +  lastid + "')";
							osvm.prepare();
							osvm.execute((error:number, result:any)=>{});
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ status: 502, message: "Something went wrong" });
							objv.execute();
						}
					});
				} else {
					let objv = new RawView(res);
					objv.prepare({ status: 400, message: "Campaigns prohibited between 9PM-9AM as per TRAI guidelines" });
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

	public saveSubmitCampaign(req: Request, res: Response, next: NextFunction) {
		console.log(req.body.data);
		let sdata = req.body.data;
		let dtmfdata = sdata.dtmfAry;
		let did = sdata.did;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				const sd = sdata.startdate;
				const se = sdata.enddate;
				// Extract the hour and minute components from the date strings
				const startDate = new Date(sd);
				const endDate = new Date(se);

				const startHour = startDate.getHours();
				const startMinute = startDate.getMinutes();
				const endHour = endDate.getHours();
				const endMinute = endDate.getMinutes();
				if (
					(startHour === 9 && startMinute === 0) && // Exactly 9:00 AM
					(endHour === 21 && endMinute === 0) // Exactly 9:00 PM
				) {
					let obj = new ModelRawNonQuery(req, res);
					obj.nonqrysql = `INSERT INTO cel_campaigns(iduser,campaign_name, campaign_type,retryType, contact_file_id, blacklist_file_id, voice_file_id, retry, dnd_check, duplicate_check, welcome_id, onhold_id, busy_id, voicemail_id, cyclenumber, cycanswered, cycunanswered, cycbusy, cycfailed, test_number, regular_minutes, regular_no, unanswered_minutes, unanswered_minutes_no, busy_minutes, busy_minutes_no, failed_minutes, failed_minutes_no, contact_file_checked, retry_type, start_date, end_date, send_sms, template_id, idaccount,id_plan, introduction, message, thankyou) VALUES ('${sessdata.id}','${sdata.campaignname}', '${sdata.campaigntype}','${sdata.retryType}', '${sdata.contactfile}','${sdata.blacklistfile}','${sdata.voicefile}', '${sdata.retry}', '${sdata.dnd}' ,'${sdata.duplicate}', '${sdata.welcomeid}', '${sdata.onholdid}', '${sdata.busyid}', '${sdata.voiceemailid}', '${sdata.cyclic}', '${sdata.cycanswered}','${sdata.cycunanswered}','${sdata.cycbusy}','${sdata.cycfailed}','${sdata.contactnumber}', '${sdata.regularminutes}','${sdata.regularno}','${sdata.unansweredminutes}','${sdata.unansweredminutesno}','${sdata.busyminutes}','${sdata.busyminutesno}','${sdata.failedminutes}','${sdata.failedminutesno}', '${sdata.contactfilechecked}', '${sdata.retry_type}', '${sdata.startdate}', '${sdata.enddate}', ${sdata.send_sms}, '${sdata.template_id}','${sessdata.idaccount}','${sessdata.plan}','${sdata.introduction}','${sdata.message}','${sdata.thankyou}')`;

					obj.prepare();
					obj.execute((error: any, result: any) => {
						if (error == 1) {

							let lastid = result.insertId;
							let objvt = new ModelRawNonQuery(req, res)
							objvt.nonqrysql = `UPDATE cel_uploads_voice SET campaign_id='${lastid}', voice_map = '1' WHERE id="${sdata.voicefile}"`;
							objvt.prepare();
							objvt.execute((error: number, result: any) => { });

							if (!sdata.contactfilechecked) {
								let obj = new ModelRawNonQuery(req, res);
								let data = sdata.contactsource.split(",");
								for (let i = 0; i < data.length; i++) {
									if (data[i] != "") {
										obj.nonqrysql = "INSERT INTO cel_leads(iduser,campaign_id,phone_no) VALUES ('" + sessdata.id + "','" + lastid + "','" + data[i] + "')";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}

								// obj.nonqrysql = "INSERT INTO cel_uploads_voice(iduser,campaign_id,enter_text,file_type) VALUES ('" + sessdata.id + "','" + lastid + "','" + sdata.enter_text + "','text_file')";
								// obj.prepare();
								// obj.execute((error: number, result: any) => { });

							} else {
								let obju = new ModelRawNonQuery(req, res)
								obju.nonqrysql = `UPDATE cel_uploads_contact SET campaign_id='${lastid}', leads_map = '1' WHERE id="${sdata.contactfile}"`;
								obju.prepare();
								obju.execute((error: number, result: any) => { });



								let objM = new ModelRawNonQuery(req, res)
								objM.nonqrysql = `UPDATE cel_leads SET campaign_id='${lastid}', status=0 WHERE upload_id ="${sdata.contactfile}"`;
								objM.prepare();
								objM.execute((error: number, result: any) => { });
							}

							if (sdata.campaigntype == 'Voice Transfer' || sdata.campaigntype == 'DTMF Capture' || sdata.campaigntype == 'TTS') {
								for (let i = 0; i < dtmfdata.length; i++) {
									let obj = new ModelRawNonQuery(req, res)
									if (dtmfdata[i].dtmftype == '1') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `audio`, `filepath` FROM `cel_uploads_dtmf` WHERE id=" + dtmfdata[i].dtmffile;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].dtmffile + ",'" + gname[0].filepath + gname[0].audio + " ')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '2') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `groupname` FROM `cel_groups` WHERE id=" + dtmfdata[i].executivesgroup;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].executivesgroup + ",'" + gname[0].groupname + "')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '3') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `template_id` FROM `cel_sms` WHERE id=" + dtmfdata[i].template_id;
										obj1.prepare();
										obj1.execute((error: any, tmp: any) => {
											if (error == 1 && tmp.length > 0) {
												obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].template_id + ",'" + tmp[0].template_id + "')";
												obj.prepare();
												obj.execute((error: number, result: any) => { });
											}
										});
									}
									else {
										obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", -1, -1)";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}
							}

							if (did.length > 0) {
								let didary: any = [];
								let count: number = 0;
								for (let i = 0; i < did.length; i++) {
									didary.push(did[i].did.toString());
									count++;
								}
								if (count == did.length) {
									let objM = new ModelRawNonQuery(req, res)
									objM.nonqrysql = "UPDATE `cel_did` SET `id_campaign`=" + lastid + " WHERE `did` IN (" + didary + ")";
									objM.prepare();
									objM.execute((error: number, result: any) => { });
								}
							}

							let objv = new RawView(res);
							objv.prepare({ status: 200, message: "Campaign Created Successfully!", data: result });
							objv.execute();
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ status: 502, message: "Something went wrong" });
							objv.execute();
						}
					});
				} else if (
					(startHour > 9 || (startHour === 9 && startMinute >= 0)) && // After 9:00 AM
					(endHour < 21 || (endHour === 21 && endMinute <= 0)) // Before 9:00 PM
				) {
					let obj = new ModelRawNonQuery(req, res);
					obj.nonqrysql = `INSERT INTO cel_campaigns(iduser,campaign_name, campaign_type,retryType, contact_file_id, blacklist_file_id, voice_file_id, retry, dnd_check, duplicate_check, welcome_id, onhold_id, busy_id, voicemail_id, cyclenumber, cycanswered, cycunanswered, cycbusy, cycfailed, test_number, regular_minutes, regular_no, unanswered_minutes, unanswered_minutes_no, busy_minutes, busy_minutes_no, failed_minutes, failed_minutes_no, contact_file_checked, retry_type, start_date, end_date, send_sms, template_id, idaccount,id_plan, introduction, message, thankyou, enter_text) VALUES ('${sessdata.id}','${sdata.campaignname}', '${sdata.campaigntype}','${sdata.retryType}', '${sdata.contactfile}','${sdata.blacklistfile}','${sdata.voicefile}', '${sdata.retry}', '${sdata.dnd}' ,'${sdata.duplicate}', '${sdata.welcomeid}', '${sdata.onholdid}', '${sdata.busyid}', '${sdata.voiceemailid}', '${sdata.cyclic}', '${sdata.cycanswered}','${sdata.cycunanswered}','${sdata.cycbusy}','${sdata.cycfailed}','${sdata.contactnumber}', '${sdata.regularminutes}','${sdata.regularno}','${sdata.unansweredminutes}','${sdata.unansweredminutesno}','${sdata.busyminutes}','${sdata.busyminutesno}','${sdata.failedminutes}','${sdata.failedminutesno}', '${sdata.contactfilechecked}', '${sdata.retry_type}', '${sdata.startdate}', '${sdata.enddate}', ${sdata.send_sms}, '${sdata.template_id}','${sessdata.idaccount}','${sessdata.plan}','${sdata.introduction}','${sdata.message}','${sdata.thankyou}','${sdata.enter_text}')`;

					obj.prepare();
					obj.execute((error: any, result: any) => {
						if (error == 1) {


							let lastid = result.insertId;

							let objvt = new ModelRawNonQuery(req, res)
							objvt.nonqrysql = `UPDATE cel_uploads_voice SET campaign_id='${lastid}', voice_map = '1' WHERE id="${sdata.voicefile}"`;
							objvt.prepare();
							objvt.execute((error: number, result: any) => { });

							if (!sdata.contactfilechecked) {
								let obj = new ModelRawNonQuery(req, res);
								let data = sdata.contactsource.split(",");
								for (let i = 0; i < data.length; i++) {
									if (data[i] != "") {
										obj.nonqrysql = "INSERT INTO cel_leads(iduser,campaign_id,phone_no) VALUES ('" + sessdata.id + "','" + lastid + "','" + data[i] + "')";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}

								// obj.nonqrysql = "INSERT INTO cel_uploads_voice(iduser,campaign_id,enter_text, file_type) VALUES ('" + sessdata.id + "','" + lastid + "','" + sdata.enter_text + "', 'text_file')";
								// obj.prepare();
								// obj.execute((error: number, result: any) => { });
							} else {
								let obju = new ModelRawNonQuery(req, res)
								obju.nonqrysql = `UPDATE cel_uploads_contact SET campaign_id='${lastid}', leads_map = '1' WHERE id="${sdata.contactfile}"`;
								obju.prepare();
								obju.execute((error: number, result: any) => { });

								let objM = new ModelRawNonQuery(req, res)
								objM.nonqrysql = `UPDATE cel_leads SET campaign_id='${lastid}', status=0 WHERE upload_id ="${sdata.contactfile}"`;
								objM.prepare();
								objM.execute((error: number, result: any) => { });
							}

							if (sdata.campaigntype == 'Voice Transfer' || sdata.campaigntype == 'DTMF Capture' || sdata.campaigntype == 'TTS') {
								for (let i = 0; i < dtmfdata.length; i++) {
									let obj = new ModelRawNonQuery(req, res)
									if (dtmfdata[i].dtmftype == '1') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `audio`, `filepath` FROM `cel_uploads_dtmf` WHERE id=" + dtmfdata[i].dtmffile;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].dtmffile + ",'" + gname[0].filepath + gname[0].audio + "')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '2') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `groupname` FROM `cel_groups` WHERE id=" + dtmfdata[i].executivesgroup;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].executivesgroup + ",'" + gname[0].groupname + "')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '3') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `template_id` FROM `cel_sms` WHERE id=" + dtmfdata[i].template_id;
										obj1.prepare();
										obj1.execute((error: any, tmp: any) => {
											if (error == 1 && tmp.length > 0) {
												obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].template_id + ",'" + tmp[0].template_id + "')";
												obj.prepare();
												obj.execute((error: number, result: any) => { });
											}
										});
									}
									else {
										obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", -1, -1)";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}
							}

							if (did.length > 0) {
								let didary: any = [];
								let count: number = 0;
								for (let i = 0; i < did.length; i++) {
									didary.push(did[i].did.toString());
									count++;
								}
								if (count == did.length) {
									let objM = new ModelRawNonQuery(req, res)
									objM.nonqrysql = "UPDATE `cel_did` SET `id_campaign`=" + lastid + " WHERE `did` IN (" + didary + ")";
									objM.prepare();
									objM.execute((error: number, result: any) => { });
								}
							}

							let objv = new RawView(res);
							objv.prepare({ status: 200, message: "Campaign Created Successfully!", data: result });
							objv.execute();
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ status: 502, message: "Something went wrong" });
							objv.execute();
						}
					});
				} else {
					let objv = new RawView(res);
					objv.prepare({ status: 400, message: "Campaigns prohibited between 9PM-9AM as per TRAI guidelines" });
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

	public testCamp(req: Request, res: Response, next: NextFunction) {
		console.log("data test::", req.body.data)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let originalData = req.body.data;
				if (originalData.did.length === 1) {
					const didItem = originalData.did[0];
					originalData.iddid = didItem.id;
				} else {
					originalData.iddid = "0";
				}
				if (originalData.did.length === 1) {
					const didItem = originalData.did[0];
					originalData.did = didItem.did;
				} else {
					originalData.did = '0';
				}
				if (originalData.dtmfAry.length === 1) {
					const dtmfAry = originalData.dtmfAry[0];
					originalData.executive_group_id = dtmfAry.executivesgroup;
				} else {
					originalData.executive_group_id = '0';
				}

				if (req.body.data.voicefile >= 0) {
					let obja = new ModelRawQuery(req, res);
					obja.qrysql = "SELECT id, iduser, audio FROM cel_uploads_voice WHERE id='" + originalData.voicefile + "'";
					obja.prepare();
					obja.execute((error: any, resultss: any) => {
						let file_generate = resultss[0].audio
						if (error == 1 && resultss.length > 0) {
							originalData.name = originalData.campaignname;
							originalData.campaign_type = originalData.campaigntype;
							originalData.start_date = originalData.startdate;
							originalData.end_date = originalData.enddate;
							originalData.contact_file_id = originalData.contactfile;
							originalData.voice_file_id = originalData.voicefile;
							originalData.iduser = sessdata.id;
							originalData.idaccount = sessdata.idaccount;
							originalData.send_sms = JSON.stringify(originalData.send_sms);
							originalData.phone_no = originalData.phone_no;
							originalData.id_campaign = req.body.data.newCamp_id;
							originalData.id = req.body.data.newCamp_id;
							originalData.cps = "";
							originalData.sipri_id = "";
							originalData.upload_did_id = "";
							originalData.free_status = "";
							originalData.user_details = "";
							originalData.miss_time = "";
							originalData.answer_time = "";
							originalData.menufile = req.body.data.newCamp_id + originalData.campaignname;
							originalData.balance = "";
							originalData.credit_limit = "";
							originalData.billing_rate = "";
							originalData.call_per_hour = "";
							originalData.starthr = "";
							originalData.startmin = "";
							originalData.endhr = "";
							originalData.endmin = "";
							originalData.node = "";
							originalData.is_status = "";
							originalData.curhr = "";
							originalData.curmin = "";
							originalData.msg_key_file = "/var/www/html/celetel/node/uploads/voices/" + file_generate;
							originalData.factor = "";
							originalData.hcf = "";
							originalData.filter = "";
							originalData.id_user = "";
							originalData.idlead = "";
							originalData.idupload = "";
							originalData.sms_enable = "";

							const propertiesToKeep = ["iddid", "did", "name", "campaign_type", "template_id", "send_sms", "start_date", "end_date", "executive_group_id", "contact_file_id", "voice_file_id", "iduser", "idaccount", "phone_no", "id_campaign", "id", "sipri_id", "cps", "filter", "upload_did_id", "free_status", "user_details", "miss_time", "answer_time", "menufile", "balance", "credit_limit", "billing_rate", "call_per_hour", "starthr", "startmin", "endhr", "endmin", "node", "is_status", "curhr", "curmin", "msg_key_file", "factor", "hcf", "id_user", "idlead", "idupload", "sms_enable"];

							for (const key in originalData) {
								if (!propertiesToKeep.includes(key)) {
									delete originalData[key];
								}
							}
							console.log("testCampaign", JSON.stringify(originalData));

							if (error == 1) {
								if (sessdata.authkey.length > 0) {
									var request = require('request');
									var options = {
										rejectUnauthorized: false,
										method: 'POST',
										url: 'https://portal.celetel.com/test/campaign',
										body: JSON.stringify(originalData),
										headers: {
											'Authorization': sessdata.authkey,
											'Content-Type': 'application/json'
										}
									};
									request(options, function (error: any, response: any, body: any) {
										if (!error) {
											let resdata: any = (response.body)
											console.log("shivam::", resdata)
											if (resdata) {
												let objv = new RawView(res);
												objv.prepare({ message: "Campaign Test Successfully!", resdata });
												objv.execute();

											} else {
												let objv = new RawView(res);
												objv.prepare({ message: resdata.message });
												objv.execute();
											}
										}
										else {
											let objv = new RawView(res);
											objv.prepare({ message: "Something went Wrong" });
											objv.execute();
										}
									});
								} else {
									let objv = new RawView(res);
									objv.prepare({ message: "Authentication Failed!" });
									objv.execute();
								}
							} else {
								let objv = new Res406(res);
								objv.prepare({ status: 401, message: "Invalid Authentication!" });
								objv.execute();
							}
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ status: 404, message: "No records found!" });
							objv.execute();
						}
					});
				}

				//end here ----
			} else {
				let objv = new Res406(res);
				objv.prepare({ status: 401, message: "Invalid Authentication!" });
				objv.execute();
			}
		})

	}


	public checkTestCamp(req: Request, res: Response, next: NextFunction) {
		// console.log("fatatatata::::", req.body.data.number.testNumber, req.body.data.id)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obja = new ModelRawQuery(req, res);
				obja.qrysql = "SELECT * FROM cel_campaigns WHERE id='" + req.body.data.id + "'";
				obja.prepare();
				obja.execute((error: any, resultss: any) => {
					let oss = new ModelRawQuery(req, res);
					oss.qrysql = "SELECT id, did FROM cel_did WHERE iduser='" + sessdata.id + "' AND id_campaign='" + req.body.data.id + "'";
					oss.prepare();
					oss.execute((error: any, result4: any) => {
						// console.log("did::", result4)
						// console.log("value", resultss)
						let originalData = resultss[0];
						let originalData_did = result4[0]
						// console.log(originalData_did)
						originalData.iddid = originalData_did.id;
						originalData.did = originalData_did.did;

						if (originalData.voice_file_id >= 0) {
							let obja = new ModelRawQuery(req, res);
							obja.qrysql = "SELECT id, iduser, audio FROM cel_uploads_voice WHERE id='" + originalData.voice_file_id + "'";
							obja.prepare();
							obja.execute((error: any, resultss1: any) => {
								let file_generate = resultss1[0].audio;
								if (error == 1 && resultss1.length > 0) {
									originalData.name = originalData.campaign_name;
									originalData.campaign_type = originalData.campaign_type;
									originalData.start_date = originalData.startdate;
									originalData.end_date = originalData.enddate;
									originalData.contact_file_id = originalData.contactfile;
									originalData.voice_file_id = originalData.voicefile;
									originalData.iduser = sessdata.id;
									originalData.idaccount = sessdata.idaccount;
									originalData.send_sms = JSON.stringify(originalData.send_sms);
									originalData.phone_no = req.body.data.number.testNumber;
									originalData.id_campaign = req.body.data.id;
									originalData.id = req.body.data.id;
									originalData.cps = "";
									originalData.sipri_id = "";
									originalData.upload_did_id = "";
									originalData.free_status = "";
									originalData.user_details = "";
									originalData.miss_time = "";
									originalData.answer_time = "";
									originalData.menufile = req.body.data.id + originalData.campaign_name;
									originalData.balance = "";
									originalData.credit_limit = "";
									originalData.billing_rate = "";
									originalData.call_per_hour = "";
									originalData.starthr = "";
									originalData.startmin = "";
									originalData.endhr = "";
									originalData.endmin = "";
									originalData.node = "";
									originalData.is_status = "";
									originalData.curhr = "";
									originalData.curmin = "";
									originalData.msg_key_file = "/var/www/html/celetel/node/uploads/voices/" + file_generate;
									originalData.factor = "";
									originalData.hcf = "";
									originalData.filter = "";
									originalData.id_user = "";
									originalData.idlead = "";
									originalData.idupload = "";
									originalData.sms_enable = "";

									const propertiesToKeep = ["iddid", "did", "name", "campaign_type", "template_id", "send_sms", "start_date", "end_date", "executive_group_id", "contact_file_id", "voice_file_id", "iduser", "idaccount", "phone_no", "id_campaign", "id", "sipri_id", "cps", "filter", "upload_did_id", "free_status", "user_details", "miss_time", "answer_time", "menufile", "balance", "credit_limit", "billing_rate", "call_per_hour", "starthr", "startmin", "endhr", "endmin", "node", "is_status", "curhr", "curmin", "msg_key_file", "factor", "hcf", "id_user", "idlead", "idupload", "sms_enable"];

									for (const key in originalData) {
										if (!propertiesToKeep.includes(key)) {
											delete originalData[key];
										}
									}

									console.log("testCampaign_01", JSON.stringify(originalData));

									if (error == 1) {
										if (sessdata.authkey.length > 0) {
											var request = require('request');
											var options = {
												rejectUnauthorized: false,
												method: 'POST',
												url: 'https://portal.celetel.com/test/campaign',
												body: JSON.stringify(originalData),
												headers: {
													'Authorization': sessdata.authkey,
													'Content-Type': 'application/json'
												}
											};
											request(options, function (error: any, response: any, body: any) {
												if (!error) {
													let resdata: any = (response.body)
													console.log("shivam::", resdata)
													if (resdata) {
														let objv = new RawView(res);
														objv.prepare({ message: "Campaign Test Successfully!", resdata });
														objv.execute();

													} else {
														let objv = new RawView(res);
														objv.prepare({ message: resdata.message });
														objv.execute();
													}
												}
												else {
													let objv = new RawView(res);
													objv.prepare({ message: "Something went Wrong" });
													objv.execute();
												}
											});
										} else {
											let objv = new RawView(res);
											objv.prepare({ message: "Authentication Failed!" });
											objv.execute();
										}
									} else {
										let objv = new Res406(res);
										objv.prepare({ status: 401, message: "Invalid Authentication!" });
										objv.execute();
									}
								}
								else {
									let objv = new RawView(res);
									objv.prepare({ status: 404, message: "No records found!" });
									objv.execute();
								}
							});
						}
					})





					//end here ----
				})
			} else {
				let objv = new Res406(res);
				objv.prepare({ status: 401, message: "Invalid Authentication!" });
				objv.execute();
			}
		})

	}

	public saveTestCampaign(req: Request, res: Response, next: NextFunction) {
		console.log("testCampaign", req.body.data);

		let sdata = req.body.data;
		let dtmfdata = sdata.dtmfAry;
		let did = sdata.did;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				const sd = sdata.startdate;
				const se = sdata.enddate;
				// Extract the hour and minute components from the date strings
				const startDate = new Date(sd);
				const endDate = new Date(se);

				const startHour = startDate.getHours();
				const startMinute = startDate.getMinutes();
				const endHour = endDate.getHours();
				const endMinute = endDate.getMinutes();
				if (
					(startHour === 9 && startMinute === 0) && // Exactly 9:00 AM
					(endHour === 21 && endMinute === 0) // Exactly 9:00 PM
				) {
					let obj = new ModelRawNonQuery(req, res);
					obj.nonqrysql = `INSERT INTO cel_campaigns(iduser,campaign_name, campaign_type,retryType, contact_file_id, blacklist_file_id, voice_file_id, retry, dnd_check, duplicate_check, welcome_id, onhold_id, busy_id, voicemail_id, cyclenumber, cycanswered, cycunanswered, cycbusy, cycfailed, test_number, regular_minutes, regular_no, unanswered_minutes, unanswered_minutes_no, busy_minutes, busy_minutes_no, failed_minutes, failed_minutes_no, contact_file_checked, retry_type, start_date, end_date, send_sms, template_id, idaccount,id_plan, introduction, message, thankyou, status) VALUES ('${sessdata.id}','${sdata.campaignname}', '${sdata.campaigntype}','${sdata.retryType}', '${sdata.contactfile}','${sdata.blacklistfile}','${sdata.voicefile}', '${sdata.retry}', '${sdata.dnd}' ,'${sdata.duplicate}', '${sdata.welcomeid}', '${sdata.onholdid}', '${sdata.busyid}', '${sdata.voiceemailid}', '${sdata.cyclic}', '${sdata.cycanswered}','${sdata.cycunanswered}','${sdata.cycbusy}','${sdata.cycfailed}','${sdata.contactnumber}', '${sdata.regularminutes}','${sdata.regularno}','${sdata.unansweredminutes}','${sdata.unansweredminutesno}','${sdata.busyminutes}','${sdata.busyminutesno}','${sdata.failedminutes}','${sdata.failedminutesno}', '${sdata.contactfilechecked}', '${sdata.retry_type}', '${sdata.startdate}', '${sdata.enddate}', ${sdata.send_sms}, '${sdata.template_id}','${sessdata.idaccount}','${sessdata.plan}','${sdata.introduction}','${sdata.message}','${sdata.thankyou}', 9)`;

					obj.prepare();
					obj.execute((error: any, result: any) => {
						if (error == 1) {

							//startrt here ---
							let originalData = req.body.data;
							if (originalData.did.length === 1) {
								const didItem = originalData.did[0];
								originalData.iddid = didItem.id;
							} else {
								originalData.iddid = "0";
							}
							if (originalData.did.length === 1) {
								const didItem = originalData.did[0];
								originalData.did = didItem.did;
							} else {
								originalData.did = '0';
							}
							if (originalData.dtmfAry.length === 1) {
								const dtmfAry = originalData.dtmfAry[0];
								originalData.executive_group_id = dtmfAry.executivesgroup;
							} else {
								originalData.executive_group_id = '0';
							}

							if (req.body.data.voicefile >= 0) {
								let obja = new ModelRawQuery(req, res);
								obja.qrysql = "SELECT id, iduser, audio FROM cel_uploads_voice WHERE id='" + originalData.voicefile + "'";
								obja.prepare();
								obja.execute((error: any, resultss: any) => {
									let file_generate = resultss[0].audio
									if (error == 1 && resultss.length > 0) {
										originalData.name = originalData.campaignname;
										originalData.campaign_type = originalData.campaigntype;
										originalData.start_date = originalData.startdate;
										originalData.end_date = originalData.enddate;
										originalData.contact_file_id = originalData.contactfile;
										originalData.voice_file_id = originalData.voicefile;
										originalData.iduser = sessdata.id;
										originalData.idaccount = sessdata.idaccount;
										originalData.send_sms = JSON.stringify(originalData.send_sms);
										originalData.phone_no = originalData.contactnumber;
										originalData.id_campaign = result.insertId;
										originalData.id = result.insertId;
										originalData.cps = "";
										originalData.sipri_id = "";
										originalData.upload_did_id = "";
										originalData.free_status = "";
										originalData.user_details = "";
										originalData.miss_time = "";
										originalData.answer_time = "";
										originalData.menufile = result.insertId + originalData.campaignname;
										originalData.balance = "";
										originalData.credit_limit = "";
										originalData.billing_rate = "";
										originalData.call_per_hour = "";
										originalData.starthr = "";
										originalData.startmin = "";
										originalData.endhr = "";
										originalData.endmin = "";
										originalData.node = "";
										originalData.is_status = "";
										originalData.curhr = "";
										originalData.curmin = "";
										originalData.msg_key_file = "/var/www/html/celetel/node/uploads/voices/" + file_generate;
										originalData.factor = "";
										originalData.hcf = "";
										originalData.filter = "";
										originalData.id_user = "";
										originalData.idlead = "";
										originalData.idupload = "";
										originalData.sms_enable = "";

										const propertiesToKeep = ["iddid", "did", "name", "campaign_type", "template_id", "send_sms", "start_date", "end_date", "executive_group_id", "contact_file_id", "voice_file_id", "iduser", "idaccount", "phone_no", "id_campaign", "id", "sipri_id", "cps", "filter", "upload_did_id", "free_status", "user_details", "miss_time", "answer_time", "menufile", "balance", "credit_limit", "billing_rate", "call_per_hour", "starthr", "startmin", "endhr", "endmin", "node", "is_status", "curhr", "curmin", "msg_key_file", "factor", "hcf", "id_user", "idlead", "idupload", "sms_enable"];

										for (const key in originalData) {
											if (!propertiesToKeep.includes(key)) {
												delete originalData[key];
											}
										}
										console.log("testCampaign", JSON.stringify(originalData));

										if (error == 1) {
											if (sessdata.authkey.length > 0) {
												var request = require('request');
												var options = {
													rejectUnauthorized: false,
													method: 'POST',
													url: 'https://portal.celetel.com/test/campaign',
													body: JSON.stringify(originalData),
													headers: {
														'Authorization': sessdata.authkey,
														'Content-Type': 'application/json'
													}
												};
												request(options, function (error: any, response: any, body: any) {
													if (!error) {
														let resdata: any = (response.body)
														console.log("shivam::", resdata)
														// if (resdata) {
														// 	let objv = new RawView(res);
														// 	objv.prepare({ message: "Campaign Test Successfully!", resdata });
														// 	objv.execute();

														// } else {
														// 	let objv = new RawView(res);
														// 	objv.prepare({ message: resdata.message });
														// 	objv.execute();
														// }
													}
													else {
														let objv = new RawView(res);
														objv.prepare({ message: "Something went Wrong" });
														objv.execute();
													}
												});
											} else {
												let objv = new RawView(res);
												objv.prepare({ message: "Authentication Failed!" });
												objv.execute();
											}
										} else {
											let objv = new Res406(res);
											objv.prepare({ status: 401, message: "Invalid Authentication!" });
											objv.execute();
										}
									}
									else {
										let objv = new RawView(res);
										objv.prepare({ status: 404, message: "No records found!" });
										objv.execute();
									}
								});
							}

							//end here ----

							let lastid = result.insertId;

							let objvt = new ModelRawNonQuery(req, res)
							objvt.nonqrysql = `UPDATE cel_uploads_voice SET campaign_id='${lastid}', voice_map = '1' WHERE id="${sdata.voicefile}"`;
							objvt.prepare();
							objvt.execute((error: number, result: any) => { });

							if (!sdata.contactfilechecked) {
								let obj = new ModelRawNonQuery(req, res);
								let data = sdata.contactsource.split(",");
								for (let i = 0; i < data.length; i++) {
									if (data[i] != "") {
										obj.nonqrysql = "INSERT INTO cel_leads(iduser,campaign_id,phone_no) VALUES ('" + sessdata.id + "','" + lastid + "','" + data[i] + "')";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}

								// obj.nonqrysql = "INSERT INTO cel_uploads_voice(iduser,campaign_id,enter_text,file_type) VALUES ('" + sessdata.id + "','" + lastid + "','" + sdata.enter_text + "','text_file')";
								// obj.prepare();
								// obj.execute((error: number, result: any) => { });

							} else {
								let obju = new ModelRawNonQuery(req, res)
								obju.nonqrysql = `UPDATE cel_uploads_contact SET campaign_id='${lastid}', leads_map = '1' WHERE id="${sdata.contactfile}"`;
								obju.prepare();
								obju.execute((error: number, result: any) => { });



								let objM = new ModelRawNonQuery(req, res)
								objM.nonqrysql = `UPDATE cel_leads SET campaign_id='${lastid}', status=0 WHERE upload_id ="${sdata.contactfile}"`;
								objM.prepare();
								objM.execute((error: number, result: any) => { });
							}

							if (sdata.campaigntype == 'Voice Transfer' || sdata.campaigntype == 'DTMF Capture' || sdata.campaigntype == 'TTS') {
								for (let i = 0; i < dtmfdata.length; i++) {
									let obj = new ModelRawNonQuery(req, res)
									if (dtmfdata[i].dtmftype == '1') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `audio`, `filepath` FROM `cel_uploads_dtmf` WHERE id=" + dtmfdata[i].dtmffile;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].dtmffile + ",'" + gname[0].filepath + gname[0].audio + " ')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '2') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `groupname` FROM `cel_groups` WHERE id=" + dtmfdata[i].executivesgroup;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].executivesgroup + ",'" + gname[0].groupname + "')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '3') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `template_id` FROM `cel_sms` WHERE id=" + dtmfdata[i].template_id;
										obj1.prepare();
										obj1.execute((error: any, tmp: any) => {
											if (error == 1 && tmp.length > 0) {
												obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].template_id + ",'" + tmp[0].template_id + "')";
												obj.prepare();
												obj.execute((error: number, result: any) => { });
											}
										});
									}
									else {
										obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", -1, -1)";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}
							}

							if (did.length > 0) {
								let didary: any = [];
								let count: number = 0;
								for (let i = 0; i < did.length; i++) {
									didary.push(did[i].did.toString());
									count++;
								}
								if (count == did.length) {
									let objM = new ModelRawNonQuery(req, res)
									objM.nonqrysql = "UPDATE `cel_did` SET `id_campaign`=" + lastid + " WHERE `did` IN (" + didary + ")";
									objM.prepare();
									objM.execute((error: number, result: any) => { });
								}
							}

							let objv = new RawView(res);
							objv.prepare({ status: 200, message: "Campaign Test Successfully!", data: result });
							objv.execute();
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ status: 502, message: "Something went wrong" });
							objv.execute();
						}
					});
				} else if (
					(startHour > 9 || (startHour === 9 && startMinute >= 0)) && // After 9:00 AM
					(endHour < 21 || (endHour === 21 && endMinute <= 0)) // Before 9:00 PM
				) {
					let obj = new ModelRawNonQuery(req, res);
					obj.nonqrysql = `INSERT INTO cel_campaigns(iduser,campaign_name, campaign_type,retryType, contact_file_id, blacklist_file_id, voice_file_id, retry, dnd_check, duplicate_check, welcome_id, onhold_id, busy_id, voicemail_id, cyclenumber, cycanswered, cycunanswered, cycbusy, cycfailed, test_number, regular_minutes, regular_no, unanswered_minutes, unanswered_minutes_no, busy_minutes, busy_minutes_no, failed_minutes, failed_minutes_no, contact_file_checked, retry_type, start_date, end_date, send_sms, template_id, idaccount,id_plan, introduction, message, thankyou, enter_text, status) VALUES ('${sessdata.id}','${sdata.campaignname}', '${sdata.campaigntype}','${sdata.retryType}', '${sdata.contactfile}','${sdata.blacklistfile}','${sdata.voicefile}', '${sdata.retry}', '${sdata.dnd}' ,'${sdata.duplicate}', '${sdata.welcomeid}', '${sdata.onholdid}', '${sdata.busyid}', '${sdata.voiceemailid}', '${sdata.cyclic}', '${sdata.cycanswered}','${sdata.cycunanswered}','${sdata.cycbusy}','${sdata.cycfailed}','${sdata.contactnumber}', '${sdata.regularminutes}','${sdata.regularno}','${sdata.unansweredminutes}','${sdata.unansweredminutesno}','${sdata.busyminutes}','${sdata.busyminutesno}','${sdata.failedminutes}','${sdata.failedminutesno}', '${sdata.contactfilechecked}', '${sdata.retry_type}', '${sdata.startdate}', '${sdata.enddate}', ${sdata.send_sms}, '${sdata.template_id}','${sessdata.idaccount}','${sessdata.plan}','${sdata.introduction}','${sdata.message}','${sdata.thankyou}','${sdata.enter_text}', 9)`;

					obj.prepare();
					obj.execute((error: any, result: any) => {
						if (error == 1) {
							//startrt here ---
							let originalData = req.body.data;
							if (originalData.did.length === 1) {
								const didItem = originalData.did[0];
								originalData.iddid = didItem.id;
							} else {
								originalData.iddid = "0";
							}
							if (originalData.did.length === 1) {
								const didItem = originalData.did[0];
								originalData.did = didItem.did;
							} else {
								originalData.did = '0';
							}
							if (originalData.dtmfAry.length === 1) {
								const dtmfAry = originalData.dtmfAry[0];
								originalData.executive_group_id = dtmfAry.executivesgroup;
							} else {
								originalData.executive_group_id = '0';
							}

							if (req.body.data.voicefile >= 0) {
								let obja = new ModelRawQuery(req, res);
								obja.qrysql = "SELECT id, iduser, audio FROM cel_uploads_voice WHERE id='" + originalData.voicefile + "'";
								obja.prepare();
								obja.execute((error: any, resultss: any) => {
									let file_generate = resultss[0].audio
									if (error == 1 && resultss.length > 0) {
										originalData.name = originalData.campaignname;
										originalData.campaign_type = originalData.campaigntype;
										originalData.start_date = originalData.startdate;
										originalData.end_date = originalData.enddate;
										originalData.contact_file_id = originalData.contactfile;
										originalData.voice_file_id = originalData.voicefile;
										originalData.iduser = sessdata.id;
										originalData.idaccount = sessdata.idaccount;
										originalData.send_sms = JSON.stringify(originalData.send_sms);
										originalData.phone_no = originalData.contactnumber;
										originalData.id_campaign = result.insertId;
										originalData.id = result.insertId;
										originalData.cps = "";
										originalData.sipri_id = "";
										originalData.upload_did_id = "";
										originalData.free_status = "";
										originalData.user_details = "";
										originalData.miss_time = "";
										originalData.answer_time = "";
										originalData.menufile = result.insertId + originalData.campaignname;
										originalData.balance = "";
										originalData.credit_limit = "";
										originalData.billing_rate = "";
										originalData.call_per_hour = "";
										originalData.starthr = "";
										originalData.startmin = "";
										originalData.endhr = "";
										originalData.endmin = "";
										originalData.node = "";
										originalData.is_status = "";
										originalData.curhr = "";
										originalData.curmin = "";
										originalData.msg_key_file = "/var/www/html/celetel/node/uploads/voices/" + file_generate;
										originalData.factor = "";
										originalData.hcf = "";
										originalData.filter = "";
										originalData.id_user = "";
										originalData.idlead = "";
										originalData.idupload = "";
										originalData.sms_enable = "";

										const propertiesToKeep = ["iddid", "did", "name", "campaign_type", "template_id", "send_sms", "start_date", "end_date", "executive_group_id", "contact_file_id", "voice_file_id", "iduser", "idaccount", "phone_no", "id_campaign", "id", "sipri_id", "cps", "filter", "upload_did_id", "free_status", "user_details", "miss_time", "answer_time", "menufile", "balance", "credit_limit", "billing_rate", "call_per_hour", "starthr", "startmin", "endhr", "endmin", "node", "is_status", "curhr", "curmin", "msg_key_file", "factor", "hcf", "id_user", "idlead", "idupload", "sms_enable"];

										for (const key in originalData) {
											if (!propertiesToKeep.includes(key)) {
												delete originalData[key];
											}
										}
										console.log("testCampaign", JSON.stringify(originalData));

										if (error == 1) {
											if (sessdata.authkey.length > 0) {
												var request = require('request');
												var options = {
													rejectUnauthorized: false,
													method: 'POST',
													url: 'https://portal.celetel.com/test/campaign',
													body: JSON.stringify(originalData),
													headers: {
														'Authorization': sessdata.authkey,
														'Content-Type': 'application/json'
													}
												};
												request(options, function (error: any, response: any, body: any) {
													if (!error) {
														let resdata: any = (response.body)
														console.log("shivam::", resdata)
														// if (resdata) {
														// 	let objv = new RawView(res);
														// 	objv.prepare({ message: "Campaign Test Successfully!", resdata });
														// 	objv.execute();

														// } else {
														// 	let objv = new RawView(res);
														// 	objv.prepare({ message: resdata.message });
														// 	objv.execute();
														// }
													}
													else {
														let objv = new RawView(res);
														objv.prepare({ message: "Something went Wrong" });
														objv.execute();
													}
												});
											} else {
												let objv = new RawView(res);
												objv.prepare({ message: "Authentication Failed!" });
												objv.execute();
											}
										} else {
											let objv = new Res406(res);
											objv.prepare({ status: 401, message: "Invalid Authentication!" });
											objv.execute();
										}
									}
									else {
										let objv = new RawView(res);
										objv.prepare({ status: 404, message: "No records found!" });
										objv.execute();
									}
								});
							}

							//end here ----
							let lastid = result.insertId;

							let objvt = new ModelRawNonQuery(req, res)
							objvt.nonqrysql = `UPDATE cel_uploads_voice SET campaign_id='${lastid}', voice_map = '1' WHERE id="${sdata.voicefile}"`;
							objvt.prepare();
							objvt.execute((error: number, result: any) => { });

							if (!sdata.contactfilechecked) {
								let obj = new ModelRawNonQuery(req, res);
								let data = sdata.contactsource.split(",");
								for (let i = 0; i < data.length; i++) {
									if (data[i] != "") {
										obj.nonqrysql = "INSERT INTO cel_leads(iduser,campaign_id,phone_no) VALUES ('" + sessdata.id + "','" + lastid + "','" + data[i] + "')";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}

								// obj.nonqrysql = "INSERT INTO cel_uploads_voice(iduser,campaign_id,enter_text, file_type) VALUES ('" + sessdata.id + "','" + lastid + "','" + sdata.enter_text + "', 'text_file')";
								// obj.prepare();
								// obj.execute((error: number, result: any) => { });
							} else {
								let obju = new ModelRawNonQuery(req, res)
								obju.nonqrysql = `UPDATE cel_uploads_contact SET campaign_id='${lastid}', leads_map = '1' WHERE id="${sdata.contactfile}"`;
								obju.prepare();
								obju.execute((error: number, result: any) => { });

								let objM = new ModelRawNonQuery(req, res)
								objM.nonqrysql = `UPDATE cel_leads SET campaign_id='${lastid}', status=0 WHERE upload_id ="${sdata.contactfile}"`;
								objM.prepare();
								objM.execute((error: number, result: any) => { });
							}

							if (sdata.campaigntype == 'Voice Transfer' || sdata.campaigntype == 'DTMF Capture' || sdata.campaigntype == 'TTS') {
								for (let i = 0; i < dtmfdata.length; i++) {
									let obj = new ModelRawNonQuery(req, res)
									if (dtmfdata[i].dtmftype == '1') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `audio`, `filepath` FROM `cel_uploads_dtmf` WHERE id=" + dtmfdata[i].dtmffile;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].dtmffile + ",'" + gname[0].filepath + gname[0].audio + "')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '2') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `groupname` FROM `cel_groups` WHERE id=" + dtmfdata[i].executivesgroup;
										obj1.prepare();
										obj1.execute((error: any, gname: any) => {
											obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].executivesgroup + ",'" + gname[0].groupname + "')";
											obj.prepare();
											obj.execute((error: number, result: any) => { });
										});
									}
									else if (dtmfdata[i].dtmftype == '3') {
										let obj1 = new ModelRawQuery(req, res);
										obj1.qrysql = "SELECT `template_id` FROM `cel_sms` WHERE id=" + dtmfdata[i].template_id;
										obj1.prepare();
										obj1.execute((error: any, tmp: any) => {
											if (error == 1 && tmp.length > 0) {
												obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", " + dtmfdata[i].template_id + ",'" + tmp[0].template_id + "')";
												obj.prepare();
												obj.execute((error: number, result: any) => { });
											}
										});
									}
									else {
										obj.nonqrysql = "INSERT INTO cel_action(`iduser`, `id_campaign`, `key`, `action`, `idaction`, `description`) VALUES ('" + sessdata.id + "','" + lastid + "','" + dtmfdata[i].dtmfno + "', " + dtmfdata[i].dtmftype + ", -1, -1)";
										obj.prepare();
										obj.execute((error: number, result: any) => { });
									}
								}
							}

							if (did.length > 0) {
								let didary: any = [];
								let count: number = 0;
								for (let i = 0; i < did.length; i++) {
									didary.push(did[i].did.toString());
									count++;
								}
								if (count == did.length) {
									let objM = new ModelRawNonQuery(req, res)
									objM.nonqrysql = "UPDATE `cel_did` SET `id_campaign`=" + lastid + " WHERE `did` IN (" + didary + ")";
									objM.prepare();
									objM.execute((error: number, result: any) => { });
								}
							}

							let objv = new RawView(res);
							objv.prepare({ status: 200, message: "Campaign Test Successfully!", data: result });
							objv.execute();
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ status: 502, message: "Something went wrong" });
							objv.execute();
						}
					});
				} else {
					let objv = new RawView(res);
					objv.prepare({ status: 400, message: "Campaigns prohibited between 9PM-9AM as per TRAI guidelines" });
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

	public getCampaign(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				// obj.qrysql = "SELECT a.id, a.`campaign_name`, a.`campaign_type`, b.`totallead` `total_no`,b.dials, b.`answer` `answered`,b.`cost`, cp.`plan_name`, b.`failed`, b.`unanswered`, b.`busy`, a.`status`, a.`created_at`, a.retryType, a.contact_file_id, a.blacklist_file_id, a.voice_file_id, a.retry, a.dnd_check, a.duplicate_check, a.no_of_retry, a.status, a.welcome_id, a.onhold_id, a.busy_id, a.voicemail_id, a.cyclenumber, a.cycanswered, a.cycunanswered, a.cycbusy, a.cycfailed, a.test_number, a.regular_minutes, a.regular_no, a.unanswered_minutes, a.unanswered_minutes_no, a.busy_minutes, a.busy_minutes_no, a.failed_minutes, a.failed_minutes_no, a.contact_file_checked, a.retry_type, a.retryType, a.start_date, a.end_date, a.send_sms, a.template_id, a.introduction, a.thankyou, a.message, a.`created_at` FROM `cel_campaigns` a LEFT JOIN (SELECT SUM(totallead) totallead, SUM(answer) answer, sum(cost) cost, SUM(failed) failed, SUM(unanswered) unanswered, SUM(busy) busy, id_campaign,SUM(dials)dials FROM `cel_campaign_log` WHERE `key` IS NOT NULL GROUP BY id_campaign) b ON a.`id`=b.`id_campaign` INNER JOIN `cel_plan` cp ON cp.`id`='" + sessdata.plan + "'  WHERE a.`iduser` = '" + sessdata.id + "' AND a.`is_deleted` = 0 ORDER BY a.`id` DESC"
				obj.qrysql = "SELECT a.id, a.campaign_name, a.campaign_type,COALESCE(b.dials, 0) AS dials, COALESCE(b.totallead, 0) AS total_no, COALESCE(b.answer, 0) AS answered, COALESCE(b.cost, 0) AS cost, cp.plan_name, COALESCE(b.failed, 0) AS failed, COALESCE(b.unanswered, 0) AS unanswered, COALESCE(b.busy, 0) AS busy, a.status, a.created_at, a.retryType,  a.contact_file_id, a.blacklist_file_id,  a.voice_file_id,a.retry, a.dnd_check, a.duplicate_check, a.no_of_retry, a.status, a.welcome_id, a.onhold_id, a.busy_id, a.voicemail_id,a.cyclenumber, COALESCE(a.cycanswered, 0) AS cycanswered, COALESCE(a.cycunanswered, 0) AS cycunanswered, COALESCE(a.cycbusy, 0) AS cycbusy, COALESCE(a.cycfailed, 0) AS cycfailed, a.test_number,  COALESCE(a.regular_minutes, 0) AS regular_minutes, COALESCE(a.regular_no, 0) AS regular_no, COALESCE(a.unanswered_minutes, 0) AS unanswered_minutes, COALESCE(a.unanswered_minutes_no, 0) AS unanswered_minutes_no, COALESCE(a.busy_minutes, 0) AS busy_minutes, COALESCE(a.busy_minutes_no, 0) AS busy_minutes_no, COALESCE(a.failed_minutes, 0) AS failed_minutes, COALESCE(a.failed_minutes_no, 0) AS failed_minutes_no, a.contact_file_checked, a.retry_type, a.retryType, a.start_date, a.end_date, a.send_sms, a.template_id, a.introduction, a.thankyou, a.message, a.created_at FROM `cel_campaigns` a LEFT JOIN  `cel_campaign_log` b ON a.id = b.id_campaign INNER JOIN `cel_plan` cp ON cp.id = '" + sessdata.plan + "' WHERE a.iduser = '" + sessdata.id + "' AND a.is_deleted = 0 GROUP BY a.id, a.iduser ORDER BY a.id DESC";
				obj.prepare();
				obj.execute((error, result) => {
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
				let objv = new Res406(res);
				objv.prepare({ status: 401, message: "Invalid Authentication!" });
				objv.execute();
			}
		});

	}

	public todayCreditUsed(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let currentDate = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
				let obj = new ModelRawQuery(req, res);
				// obj.qrysql = "SELECT cost FROM dialer_log WHERE iduser='" + sessdata.id + "' AND DATE(call_time) = '" + currentDate + "'";
				obj.qrysql = "SELECT cost FROM cel_campaign_log WHERE iduser='" + sessdata.id + "' AND DATE(created_at) = '" + currentDate + "'";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "loaded Successfully!", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No records found!" });
						objv.execute();
					}
				})

				// let obj = new ModelRawQuery(req, res);
				// obj.qrysql = "SELECT DISTINCT a.id_plan, b.plan FROM cel_campaigns a INNER JOIN cel_plan b ON a.id_plan = b.id WHERE a.`iduser` = '" + sessdata.id + "'"
				// obj.prepare();
				// obj.execute((error: any, result: any) => {
				// 	console.log('result10', result, error)
				// 	if (result.length < 1) {
				// 		let obj = new RawView(res);
				// 		obj.prepare({ status: 404, message: "Something went wrong" });
				// 		obj.execute();
				// 	} else {
				// 		if (result[0].plan == 1) {
				// 			// second
				// 			let obja = new ModelRawQuery(req, res);
				// 			obja.qrysql = "SELECT (SUM(d.duration) * p.rate) AS costs, SUM(d.duration) AS duration, a.id_plan, a.id, p.rate, p.plan, p.type, p.plan_name, b.`created_at` FROM `cel_campaigns` a LEFT JOIN `cel_campaign_log` b ON a.`id` = b.`id_campaign` LEFT JOIN `dialer_log` d ON a.id = d.idcampaign INNER JOIN `cel_plan` p ON a.id_plan = p.id WHERE a.`iduser` = '" + sessdata.id + "' AND DATE(b.`created_at`) = '" + currentDate + "' GROUP BY a.`id`, a.`iduser` ORDER BY a.`id` DESC";

				// 			obja.prepare();
				// 			obja.execute((error: any, result: any) => {
				// 				if (error == 1 && result.length > 0) {
				// 					let objv = new RawView(res);
				// 					objv.prepare({ status: 200, message: "Campaign loaded Successfully!", data: result });
				// 					objv.execute();
				// 				}
				// 				else {
				// 					let objv = new RawView(res);
				// 					objv.prepare({ status: 404, message: "No records found!" });
				// 					objv.execute();
				// 				}
				// 			});

				// 		} else {
				// 			// pulse
				// 			let objb = new ModelRawQuery(req, res);
				// 			objb.qrysql = "SELECT (SUM(d.pulse) * p.rate) AS costs, SUM(d.pulse) AS pulse, a.id_plan, a.id, p.rate, p.plan, p.type, p.plan_name, b.`created_at` FROM `cel_campaigns` a LEFT JOIN `cel_campaign_log` b ON a.`id` = b.`id_campaign` LEFT JOIN `dialer_log` d ON a.id = d.idcampaign INNER JOIN `cel_plan` p ON a.id_plan = p.id WHERE a.`iduser` = '" + sessdata.id + "' AND DATE(b.`created_at`) = '" + currentDate + "' GROUP BY a.`id`, a.`iduser` ORDER BY a.`id` DESC";
				// 			objb.prepare();
				// 			objb.execute((error: any, result: any) => {
				// 				if (error == 1 && result.length > 0) {
				// 					let objv = new RawView(res);
				// 					objv.prepare({ status: 200, message: "Campaign loaded Successfully!", data: result });
				// 					objv.execute();
				// 				}
				// 				else {
				// 					let objv = new RawView(res);
				// 					objv.prepare({ status: 404, message: "No records found!" });
				// 					objv.execute();
				// 				}
				// 			});
				// 		}
				// 	}


				// })

			}
			else {
				let objv = new Res406(res);
				objv.prepare({ status: 401, message: "Invalid Authentication!" });
				objv.execute();
			}
		});

	}
	// //coast all campaign 
	// public campaigncastcalue(req: Request, res: Response, next: NextFunction) {
	// 	let session = new SessionManagment(req, res, next);
	// 	session.GetSession((error: number, sessdata: any) => {
	// 		if (error == 1) {
	// 			let obj = new ModelRawQuery(req, res);
	// 			obj.qrysql = "SELECT DISTINCT a.id_plan, b.plan FROM cel_campaigns a INNER JOIN cel_plan b ON a.id_plan = b.id WHERE a.`iduser` = '" + sessdata.id + "'"
	// 			obj.prepare();
	// 			obj.execute((error: any, result: any) => {
	// 				console.log('result5', result, error)
	// 				if (result.length < 1) {
	// 					let obj = new RawView(res);
	// 					obj.prepare({ status: 404, message: "Something went wrong" });
	// 					obj.execute();
	// 				} else {
	// 					if (result[0].plan == 1) {
	// 						// second
	// 						let obja = new ModelRawQuery(req, res);
	// 						obja.qrysql = "SELECT (SUM(d.duration) * p.rate) AS costs, SUM(d.duration) AS duration, a.id_plan, a.id, p.rate, p.plan, p.type, p.plan_name, a.`campaign_name`, a.`campaign_type`,  a.status	FROM `cel_campaigns` a LEFT JOIN `cel_campaign_log` b ON a.`id` = b.`id_campaign` LEFT JOIN `dialer_log`  d ON a.id = d.idcampaign LEFT JOIN  `cel_plan` p ON a.id_plan = p.id WHERE a.`iduser` = '" + sessdata.id + "' AND a.`status`= 4 AND a.`is_deleted` = 0 AND b.`cost`= 0 GROUP BY a.`id`, a.`iduser` ORDER BY a.`id` DESC";
	// 						obja.prepare();
	// 						obja.execute((error: any, result: any) => {
	// 							for (var i = 0; i < result.length; i++) {
	// 								console.log("shivama :::", result[i])
	// 								let cost_new = result[i].costs == null ? 0 : result[i].costs
	// 								console.log("dd", cost_new)
	// 								let objb = new ModelRawQuery(req, res);
	// 								objb.qrysql = "UPDATE cel_campaign_log SET cost='" + cost_new + "'  WHERE  id_campaign=(SELECT id FROM cel_campaigns WHERE id = '" + result[i].id + "' AND iduser='" + sessdata.id + "') AND iduser='" + sessdata.id + "'";
	// 								objb.prepare();
	// 								objb.execute((error: any, resdfsdf: any) => { })
	// 							}
	// 						});
	// 					} else {
	// 						// pulse
	// 						let objb = new ModelRawQuery(req, res);
	// 						objb.qrysql = "SELECT  (SUM(d.pulse) * p.rate) AS costs, SUM(d.pulse) AS pulse, a.id_plan, a.id, p.rate, p.plan, p.type, p.plan_name, a.`campaign_name`, a.`campaign_type`,  a.status	FROM `cel_campaigns` a LEFT JOIN `cel_campaign_log` b ON a.`id` = b.`id_campaign` LEFT JOIN `dialer_log`  d ON a.id = d.idcampaign LEFT JOIN  `cel_plan` p ON a.id_plan = p.id WHERE a.`iduser` = '" + sessdata.id + "' AND a.`status`= 4 AND a.`is_deleted` = 0 AND b.`cost`= 0 GROUP BY a.`id`, a.`iduser` ORDER BY a.`id` DESC";
	// 						objb.prepare();
	// 						objb.execute((error: any, result: any) => {
	// 							for (var i = 0; i < result.length; i++) {
	// 								console.log("shivama :::", result[i])
	// 								let cost_new = result[i].costs == null ? 0 : result[i].costs
	// 								console.log("dd", cost_new)
	// 								let objb = new ModelRawQuery(req, res);
	// 								objb.qrysql = "UPDATE cel_campaign_log SET cost='" + cost_new + "'  WHERE  id_campaign=(SELECT id FROM cel_campaigns WHERE id = '" + result[i].id + "' AND iduser='" + sessdata.id + "') AND iduser='" + sessdata.id + "'";
	// 								objb.prepare();
	// 								objb.execute((error: any, resdfsdf: any) => { })
	// 							}
	// 						});
	// 					}
	// 				}


	// 			})
	// 		}
	// 		else {
	// 			let objv = new Res406(res);
	// 			objv.prepare({ status: 401, message: "Invalid Authentication!" });
	// 			objv.execute();
	// 		}
	// 	});

	// }

	public getUploadContact(req: Request, res: Response, next: NextFunction) {
		//console.log("assss",req)
		let sdata = req.query.type
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = "SELECT id,filename,size,file_type,DATE_FORMAT(created_at,'%Y-%m-%d')`date`,total_count FROM `cel_uploads_contact` WHERE file_type='" + sdata + "' AND iduser='" + sessdata.id + "' ";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		});

	}

	public getUploadVoice(req: Request, res: Response, next: NextFunction) {
		//console.log("assss",req)
		let sdata = req.query.type
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = "SELECT id,filename,size,file_type,status,filepath,audio,voice_map,DATE_FORMAT(created_at,'%Y-%m-%d')`date`,total_count FROM `cel_uploads_voice` WHERE file_type='" + sdata + "' AND iduser='" + sessdata.id + "'";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ status: 200, data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		});

	}

	public getUploadDtmf(req: Request, res: Response, next: NextFunction) {
		//console.log("assss",req)
		let sdata = req.query.type
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = "SELECT id,filename,size,file_type,status,audio,DATE_FORMAT(created_at,'%Y-%m-%d')`date`,total_count FROM `cel_uploads_dtmf` WHERE file_type='" + sdata + "' AND iduser='" + sessdata.id + "' ";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		});

	}

	public getsoundfiles(req: Request, res: Response, next: NextFunction) {
		//console.log("assss",req)
		let sdata = req.query.type
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = "SELECT id, file_name, filetype,audio FROM `cel_ivr` WHERE iduser = '" + sessdata.id + "'";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		});

	}

	public getUploadBlock(req: Request, res: Response, next: NextFunction) {
		//console.log("assss",req)
		let sdata = req.query.type
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = "SELECT id,filename,size,file_type,DATE_FORMAT(created_at,'%Y-%m-%d')`date`,total_count FROM `cel_uploads_block` WHERE file_type='" + sdata + "' AND iduser='" + sessdata.id + "' ";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		});

	}

	public uploadcontactFile(req: Request, res: Response, next: NextFunction) {
		console.log(req.file)
		let type = req.body.type;
		let extence = req.body.extance;
		console.log("dasd", extence, type);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let nvalue: any = req.file
				if (nvalue.mimetype == 'text/csv') {
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
										objv.prepare({ status: 200, message: `Contact File Uploaded Successfully!`, data: { id: lastid, filename: fdata[0], campaign_id: 0 } });
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
				} else if (nvalue.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || nvalue.mimetype == 'application/vnd.ms-excel') {
					var uploaddir = new UploadDirectory();
					let fname = "cfile" + (new Date().getTime()) + '.csv';
					let fpath = uploaddir.UPLOADSDIR;
					let size = (((nvalue.size) / 1024) / 1024).toFixed(3);
					const workbook = XLSX.readFile(nvalue.path);
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
							obja.nonqrysql = `INSERT INTO cel_uploads_contact(iduser, filename, file_type, filepath, size) VALUES ("${sessdata.id}","${nvalue.originalname}", "${req.body.type}", "${fpath}", ${size})`;
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
												objv.prepare({ status: 200, message: `Contact File Uploaded Successfully!`, data: { id: lastid, filename: nvalue.originalname, campaign_id: 0 } });
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

	public particulerUploadcontactFile(req: Request, res: Response, next: NextFunction) {
		console.log(req.file)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let nvalue: any = req.file
				if (nvalue.mimetype == 'text/csv') {
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
								let osvm = new ModelRawNonQuery(req, res);
								osvm.nonqrysql = "UPDATE `cel_campaigns` SET `contact_file_id`= '" + lastid + "' WHERE id = '" + req.body.id + "' AND iduser = '" + sessdata.id + "'";
								osvm.execute((error: any, res: any) => { })

								let obj = new ModelRawNonQuery(req, res);
								obj.nonqrysql = "UPDATE `cel_uploads_contact` SET `total_count`= '" + totalcount + "' WHERE id = '" + lastid + "'";
								obj.prepare();
								obj.execute((error: any, result: any) => {
									if (error == 1) {
										let objv = new RawView(res);
										objv.prepare({ status: 200, message: `Contact File Uploaded Successfully!`, data: { id: lastid, filename: fdata[0], campaign_id: 0 } });
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
				} else if (nvalue.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || nvalue.mimetype == 'application/vnd.ms-excel') {
					var uploaddir = new UploadDirectory();
					let fname = "cfile" + (new Date().getTime()) + '.csv';
					let fpath = uploaddir.UPLOADSDIR;
					let size = (((nvalue.size) / 1024) / 1024).toFixed(3);
					const workbook = XLSX.readFile(nvalue.path);
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
							obja.nonqrysql = `INSERT INTO cel_uploads_contact(iduser, filename, file_type, filepath, size) VALUES ("${sessdata.id}","${nvalue.originalname}", "${req.body.type}", "${fpath}", ${size})`;
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
												objv.prepare({ status: 200, message: `Contact File Uploaded Successfully!`, data: { id: lastid, filename: nvalue.originalname, campaign_id: 0 } });
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

	public uploadblackFiles(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
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
						// obj.nonqrysql = "LOAD DATA LOCAL INFILE  '" + fdata[1] + fdata[0] + "' INTO TABLE cel_blockleads FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (@cal1,@cal2,@cal3) SET phone_no=@cal1, iduser = '" + sessdata.id + "', upload_id='" + lastid + "'";
						obj.nonqrysql = "LOAD DATA LOCAL INFILE '" + fdata[1] + fdata[0] + "' INTO TABLE cel_blockleads FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (@cal1) SET phone_no = REPLACE(REPLACE(REPLACE(REPLACE(@cal1, '\r', ''), '\n', ''), '\"', ''), '\t', ''), iduser = '" + sessdata.id + "', upload_id = '" + lastid + "'";
						obj.prepare();
						obj.execute((error: number, result: any) => {
							let objd = new ModelRawQuery(req, res);
							objd.qrysql = "SELECT COUNT(upload_id)`total` FROM cel_blockleads WHERE upload_id = '" + lastid + "'";
							objd.prepare();
							objd.execute((error: any, resultss: any) => {
								let totalcount = resultss[0].total
								let obj = new ModelRawNonQuery(req, res);
								obj.nonqrysql = "UPDATE `cel_uploads_block` SET `total_count`= '" + totalcount + "' WHERE id = '" + lastid + "'";
								obj.prepare();
								obj.execute((error: any, result: any) => {
									if (error == 1) {
										let objv = new RawView(res);
										objv.prepare({ status: 200, message: `Block Files Upload Successfully!`, data: { id: lastid, filename: fdata[0] } });
										objv.execute();
									}
									else {
										let objv = new RawView(res);
										objv.prepare({ status: 502, message: `Block Files Uploads Failed!`, data: {} });
										objv.execute();
									}
								});
							});
						});
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 502, message: `Block Files Uploads Failed !` });
						objv.execute();
					}
				});
			}
			else {
				let objv = new Res406(res);
				objv.prepare({ status: 401, message: "Invalid Authentication!" });
				objv.execute();
			}
		});
	}

	public uploadDtmfFile(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let objfile = new ModelOtherUpload(req, res);
				let fdata: any = objfile.fileDtmfUpload();
				let size = (fdata[3] / 1024 / 1024).toFixed(3);
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = `INSERT INTO cel_uploads_dtmf(iduser, filename, file_type, filepath, size, audio) VALUES ("${sessdata.id}","${fdata[0]}", "${req.body.type}", "${fdata[1]}", ${size},"${fdata[4]}")`;
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: `DTMF File Inserted Successfully!`, data: { id: result.insertId, filename: fdata[0] } });
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: 502, message: `DTMF File upload failed!`, data: {} });
						objv.execute();
					}
				});
			}
			else {
				let objv = new Res406(res);
				objv.prepare({ status: 401, message: "Invalid Authentication!" });
				objv.execute();
			}
		})
	}

	public uploadVoiceFiles(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let objfile = new ModelOtherUpload(req, res);
				let fdata: any = objfile.AudioUpload();
				let size = (fdata[3] / 1024 / 1024).toFixed(3);
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = `INSERT INTO cel_uploads_voice(iduser,filename, file_type, filepath, size, audio) VALUES ("${sessdata.id}","${fdata[0]}", "${req.body.type}", "${fdata[1]}", ${size},"${fdata[4]}")`;
				obj.prepare();
				obj.execute((error: any, lastid: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: `${req.body.type} Inserted Successfully!`, data: { id: lastid.insertId, filename: fdata[0] } });
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: 502, message: `Voice File upload failed!`, data: {} });
						objv.execute();
					}
				});
			}
			else {
				let objv = new Res406(res);
				objv.prepare({ status: 401, message: "Invalid Authentication!" });
				objv.execute();
			}
		})
	}

	public deletecontact(req: Request, res: Response, next: NextFunction) {
		let idxx = req.query.id
		let type = req.query.type
		console.log("deletect od::", idxx, type)
		if (type == 'Contact File') {
			let session = new SessionManagment(req, res, next);
			session.GetSession((error: number, sessdata: any) => {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "DELETE FROM `cel_uploads_contact` WHERE `id`='" + idxx + "' AND `iduser` = '" + sessdata.id + "' ";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result.affectedRows == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Leads Deleted Successfully" });
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong" });
						objv.execute();
					}
				});
			})
		} else if (type == 'Voice File') {
			let session = new SessionManagment(req, res, next);
			session.GetSession((error: number, sessdata: any) => {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "DELETE FROM `cel_uploads_voice` WHERE `id`='" + idxx + "' AND `iduser` = '" + sessdata.id + "' ";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result.affectedRows == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Voice Deleted Successfully" });
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong" });
						objv.execute();
					}

				});
			})

		} else if (type == 'DTMF FIle') {
			let session = new SessionManagment(req, res, next);
			session.GetSession((error: number, sessdata: any) => {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "DELETE FROM `cel_uploads_dtmf` WHERE `id`='" + idxx + "' AND `iduser` = '" + sessdata.id + "' ";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result.affectedRows == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "DTMF Deleted Successfully" });
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong" });
						objv.execute();
					}

				});

			})

		} else if (type == 'Block List') {
			let session = new SessionManagment(req, res, next);
			session.GetSession((error: number, sessdata: any) => {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "SELECT blacklist_file_id, id FROM cel_campaigns WHERE iduser = '" + sessdata.id + "'";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					const agentArray = result.map((row: { blacklist_file_id: any; }) => Number(row.blacklist_file_id));
					const matchedData = [];
					if (agentArray.includes(Number(idxx))) {
						matchedData.push(idxx);
					}
					if (matchedData.length < 1) {
						let obj = new ModelRawNonQuery(req, res);
						obj.nonqrysql = "DELETE FROM `cel_uploads_block` WHERE `id`='" + idxx + "' AND `iduser` = '" + sessdata.id + "' ";
						obj.prepare();
						obj.execute((error: any, result: any) => {
							if (result.affectedRows == 1) {
								let objv = new RawView(res);
								objv.prepare({ status: 200, message: "Block File Deleted Successfully" });
								objv.execute();
							} else {
								let objv = new RawView(res);
								objv.prepare({ status: 500, message: "Something went wrong" });
								objv.execute();
							}
						});
					} else {
						const objv = new RawView(res);
						objv.prepare({ status: 400, message: "File assigned with campaign!" });
						objv.execute();
					}
				});


			})

		} else if (type == 'text_file') {
			let session = new SessionManagment(req, res, next);
			session.GetSession((error: number, sessdata: any) => {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "DELETE FROM `cel_uploads_voice` WHERE `id`='" + idxx + "' AND `iduser` = '" + sessdata.id + "' ";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result.affectedRows == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Voice Deleted Successfully" });
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong" });
						objv.execute();
					}

				});
			})

		}
	}

	public updateDIDService(req: Request, res: Response, next: NextFunction) {
		console.log("updateData", req.body.data, req.query.id)
		let did = req.body.data.didnumber;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (did.length > 0) {
				let didary: any = [];
				let count: number = 0;
				for (let i = 0; i < did.length; i++) {
					didary.push(did[i].did.toString());
					count++;
				}
				if (count == did.length) {
					let osvm = new ModelRawNonQuery(req, res);
					osvm.nonqrysql = "UPDATE `cel_campaigns` SET  `status`= 1 WHERE id = '" + req.query.id + "' AND iduser = '" + sessdata.id + "'";
					osvm.execute((error: any, res: any) => { })

					let objM = new ModelRawNonQuery(req, res)
					objM.nonqrysql = "UPDATE `cel_did` SET `id_campaign`=" + req.query.id + " WHERE `did` IN (" + didary + ")";
					objM.prepare();
					objM.execute((error: number, result: any) => { });
				}



				let objv = new RawView(res);
				objv.prepare({ status: 200, message: "DID Updated Successfully!" });
				objv.execute();
			}
		})
	}

	public updateCampaign(req: Request, res: Response, next: NextFunction) {
		let count = 0;
		// console.log(req.file)
		let sdata = req.body.data;
		// console.log("sdata........", sdata);
		let uploadcontact = req.body.file
		// console.log("\\\\\\\\\\\\\\\\\\\\", uploadcontact);
		let contactsourcefile = sdata.contactsource
		if (sdata.contactsource) {
			if (contactsourcefile.indexOf(',') > -1) {
			}

			else if (contactsourcefile.indexOf(' ') > -1) {
				contactsourcefile = contactsourcefile.split(" ").join(',');
			}

			else if (contactsourcefile.indexOf('\n') > -1) {

				contactsourcefile = contactsourcefile.split("\n").join(',');
			}

			let totalcount = contactsourcefile.split(',');
			count = totalcount.length
			console.log('total count', count);
		}
		else {
			console.log('Contact source not exist...');
		}

		let obj = new ModelRawQuery(req, res);
		obj.qrysql = `UPDATE cel_campaigns SET retry='${sdata.retry}', scedule='${sdata.schedule}', cyclenumber=${sdata.cyclic}, unanswered=${sdata.unanswered}, busy=${sdata.busy}, failed=${sdata.failed}, regular_minutes=${sdata.regularminutes}, unanswered_minutes=${sdata.unansweredminutes}, busy_minutes=${sdata.busyminutes}, failed_minutes=${sdata.failedminutes}, regular_no=${sdata.regularno}, unanswered_minutes_no=${sdata.unansweredminutesno}, busy_minutes_no=${sdata.busyminutesno}, failed_minutes_no=${sdata.failedminutesno}, dnd_check=${sdata.dnd}, retry_type=${sdata.retry_type}, start_date='${sdata.startdate}', end_date='${sdata.enddate}' WHERE `;

		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				let objv = new RawView(res);
				objv.prepare({ error: 0, message: "Campaign Data Updated Successfully", data: result });
				objv.execute();
			}
			else {
				let objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})

	}

	public deleteCampaign(req: Request, res: Response, next: NextFunction) {

		let sdata = req.body.data;
		let obj = new ModelRawQuery(req, res);
		// obj.qrysql = `DELETE FROM campaigns WHERE `;
		obj.qrysql = `UPDATE cel_campaigns SET is_deleted = '1' WHERE `;
		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				let objv = new RawView(res);
				objv.prepare({ error: 0, message: "Campaign Data Deleted Successfully", data: result });
				objv.execute();
			}
			else {
				let objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})

	}

	public updateCampaignStatus(req: Request, res: Response, next: NextFunction) {

		let sdata = req.body.data;
		console.log("satus st", sdata);
		console.log("satus st", sdata);

		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			// obj.qrysql = `DELETE FROM campaigns WHERE `;
			obj.qrysql = "UPDATE cel_campaigns SET action='" + sdata + "' WHERE ";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let obj = new ModelRawNonQuery(req, res);
					obj.nonqrysql = "SELECT id, iduser, IF(action='1','Start','Pause')STATUS FROM cel_campaigns";
					obj.prepare()
					obj.execute((error: number, result: any) => {
						let objv = new RawView(res);
						objv.prepare({ error: 0, message: "status Successfully Update!", data: result });
						objv.execute();
					})
				}
				// if (result) {
				// 	let objv = new RawView(res);
				// 	objv.prepare({ error: 0, message: "Campaign Status Update Successfully", data: result });
				// 	objv.execute();
				// }
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})
		})


	}

	public changestatus(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data
		if (sdata.changst == 2) {
			console.log("Running")
			let session = new SessionManagment(req, res, next);
			session.GetSession((error: number, sessdata: any) => {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "UPDATE cel_campaigns SET status='" + sdata.changst + "' WHERE  id = '" + sdata.id + "'";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result.affectedRows == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Campaign Running Successfully", data: "" });
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong" });
						objv.execute();
					}
				})
			})
		} else {
			console.log("Pause")
			let session = new SessionManagment(req, res, next);
			session.GetSession((error: number, sessdata: any) => {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "UPDATE cel_campaigns SET status='" + sdata.changst + "' WHERE  id = '" + sdata.id + "'";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result.affectedRows == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Campaign Pause Successfully", data: "" });
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong" });
						objv.execute();
					}
				})
			})
		}
		// let session = new SessionManagment(req, res, next);
		// session.GetSession((error: number, sessdata: any) => {
		// 	let obj = new ModelRawQuery(req, res);
		// 	obj.qrysql = "UPDATE cel_campaigns SET status='" + sdata.changst + "' WHERE  id = '" + sdata.id + "'";
		// 	obj.prepare();
		// 	obj.execute((error: any, result: any) => {
		// 		let objv = new RawView(res);
		// 		objv.prepare({ status: 0, message: "No records found!" });
		// 		objv.execute();
		// 	})
		// })
	}

	public getTotalContactNo(req: Request, res: Response, next: NextFunction) {
		//console.log("assss",req)
		let sdata = req.query.type
		console.log('edit campaign id', sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = `SELECT id, phone_no, campaign_id FROM cel_leads WHERE  iduser = ${sessdata.id} AND campaign_id = ${req.query.type}`;
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		});

	}

	public widgetReport(req: Request, res: Response, next: NextFunction) {
		let svalue: any = req.query.type
		let sdata = JSON.parse(svalue);
		console.log('Date Filter', sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "SELECT SUM(cl.answer)`answer`, SUM(cl.dials)`total`, (SELECT COUNT(id_call) FROM cel_agent_cdr WHERE iduser='" + sessdata.id + "' AND DATE_FORMAT(`start_stamp`, '%Y-%m-%d')>='" + sdata.start + "' AND DATE_FORMAT(`start_stamp`, '%Y-%m-%d')<='" + sdata.end + "')`transfer`, SUM(cl.busy+cl.unanswered+cl.failed)`decline` FROM `cel_campaign_log` cl  WHERE cl.`iduser`='" + sessdata.id + "' AND DATE_FORMAT(cl.`created_at`, '%Y-%m-%d')>='" + sdata.start + "' AND DATE_FORMAT(cl.`created_at`, '%Y-%m-%d')<='" + sdata.end + "'";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result[0] });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public missCallSummaryReport(req: Request, res: Response, next: NextFunction) {
		let fValue: any = req.query.type
		let sdata = JSON.parse(fValue);
		console.log('Miss Call Date Filter', sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "SELECT COUNT(*) AS `misscall`, `create_at` FROM cel_sent_sms " +
					"WHERE `id_account`='" + sessdata.idaccount + "' AND DATE_FORMAT(create_at, '%Y-%m-%d') >= '" + sdata.start + "' " +
					"AND DATE_FORMAT(create_at, '%Y-%m-%d') <= '" + sdata.end + "' GROUP BY DATE_FORMAT(create_at, '%Y-%m-%d')";
				obj.prepare();
				obj.execute((error: any, result1: any) => {

					let obj1 = new ModelRawQuery(req, res);
					obj1.qrysql = "SELECT COUNT(*) AS `sms_sent`, `create_at` FROM cel_sent_sms " +
						"WHERE `id_account`='" + sessdata.idaccount + "' AND DATE_FORMAT(create_at, '%Y-%m-%d') >= '" + sdata.start + "' " +
						"AND DATE_FORMAT(create_at, '%Y-%m-%d') <= '" + sdata.end + "' GROUP BY DATE_FORMAT(create_at, '%Y-%m-%d')";
					obj1.prepare();
					obj1.execute((error: any, result: any) => {
						if (result) {
							let objw = new RawView(res);
							objw.prepare({ status: 200, message: "Miss Call Summary Report loaded successfully", data: result, result1 });
							objw.execute();
						}
						else {
							let objw = new RawView(res);
							objw.prepare({ status: 404, message: "No data found!", data: [] });
							objw.execute();
						}
					})
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public forSummaryTTSRep(req: Request, res: Response, next: NextFunction) {
		let sdata = req.query.type;
		console.log('tts summary Filter', sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = `SELECT COUNT(*) calls,  key_press FROM dialer_log WHERE iduser = ${sessdata.id} AND idcampaign = ${req.query.type} GROUP BY key_press  ORDER BY id DESC LIMIT 10000`;
				obj.prepare();
				obj.execute((error: any, result1: any) => {

					let obj1 = new ModelRawQuery(req, res);
					obj1.qrysql = `SELECT COUNT(*) sms,  key_press FROM dialer_log WHERE iduser = ${sessdata.id} AND idcampaign = ${req.query.type} GROUP BY key_press  ORDER BY id DESC LIMIT 10000`;
					obj1.prepare();
					obj1.execute((error: any, result: any) => {
						if (result) {
							let objw = new RawView(res);
							objw.prepare({ status: 200, message: "Report loaded successfully", data: result, result1 });
							objw.execute();
						}
						else {
							let objw = new RawView(res);
							objw.prepare({ status: 404, message: "No data found!", data: [] });
							objw.execute();
						}
					})
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getFillterALlTTSRepo(req: Request, res: Response, next: NextFunction) {
		let sdata = req.query.type;
		console.log('tts summary Filter', sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = `SELECT COUNT(*) calls,  key_press FROM dialer_log WHERE iduser = ${sessdata.id} AND idcampaign = ${req.query.type} GROUP BY key_press LIMIT 10000`;
				obj.prepare();
				obj.execute((error: any, result1: any) => {

					let obj1 = new ModelRawQuery(req, res);
					obj1.qrysql = `SELECT COUNT(*) sms,  key_press FROM dialer_log WHERE iduser = ${sessdata.id} AND idcampaign = ${req.query.type} GROUP BY key_press LIMIT 10000`;
					obj1.prepare();
					obj1.execute((error: any, result: any) => {
						if (result) {
							let objw = new RawView(res);
							objw.prepare({ status: 200, message: "Report loaded successfully", data: result, result1 });
							objw.execute();
						}
						else {
							let objw = new RawView(res);
							objw.prepare({ status: 404, message: "No data found!", data: [] });
							objw.execute();
						}
					})
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}




	public graphReport(req: Request, res: Response, next: NextFunction) {
		let gValue: any = req.query.type
		let sdata = JSON.parse(gValue);
		console.log('Date Filter', sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				// obj.qrysql = "SELECT SUM(answer)`answer`, SUM(totallead)`total`, SUM(transfer)`transfer`, SUM(busy+unanswered+failed)`decline`, DATE_FORMAT(created_at, '%Y-%m-%d')`date` FROM `cel_campaign_log` WHERE iduser='" + sessdata.id + "' AND DATE_FORMAT(created_at, '%Y-%m-%d')>='" + sdata.start + "' AND DATE_FORMAT(created_at, '%Y-%m-%d')<='" + sdata.end + "' GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')";

				obj.qrysql = "SELECT SUM(cl.answer)`answer`, SUM(cl.dials)`total`, SUM(cl.transfer)`transfer`, SUM(cl.busy+cl.unanswered+cl.failed)`decline`, DATE_FORMAT(cl.`created_at`, '%Y-%m-%d')`date` FROM `cel_campaign_log` cl  WHERE cl.`iduser`='" + sessdata.id + "' AND DATE_FORMAT(cl.`created_at`, '%Y-%m-%d')>='" + sdata.start + "' AND DATE_FORMAT(cl.`created_at`, '%Y-%m-%d')<='" + sdata.end + "' GROUP BY  DATE_FORMAT(cl.`created_at`, '%Y-%m-%d'), cl.iduser";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getDtmfUser(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = `SELECT id, username FROM cel_users WHERE idaccount = 56 AND JSON_CONTAINS(campain_type, '{"type": "DTMF Capture"}')`;
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getAllDTMFCamp(req: Request, res: Response, next: NextFunction) {
		var sdata = req.body.data;
		console.log("userid", sdata)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = `SELECT id, campaign_name FROM cel_campaigns WHERE campaign_type = 'DTMF Capture' AND iduser = ${sdata.id}`;
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}



	public getDatadtmfSummery(req: Request, res: Response, next: NextFunction) {
		console.log("campid", req.query)
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);

				// if (campid)
				// 	obj.qrysql = "SELECT COUNT(*) `calls`,  dl.`key_press` FROM `dialer_log` dl LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='"+ campid + "' AND dl.key_press!='' AND cc.campaign_type='DTMF Capture' GROUP BY dl.`key_press` ORDER BY dl.`timestamp` DESC LIMIT 10000";
				// else
				// 	obj.qrysql = "SELECT COUNT(*) `calls`,  dl.`key_press` FROM `dialer_log` dl LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.`iduser`='"+ sessdata.id +"' AND dl.key_press!='' AND cc.campaign_type='DTMF Capture' GROUP BY dl.`key_press` ORDER BY dl.`timestamp` DESC LIMIT 10000";

				if (campid)
					obj.qrysql = "SELECT COUNT(*) `calls`,  `key_press` FROM `dialer_log` WHERE `idcampaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' AND key_press!='' GROUP BY `key_press` ORDER BY `timestamp` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT COUNT(*) `calls`,  `key_press` FROM `dialer_log` WHERE `iduser`='" + sessdata.id + "' AND key_press!='' GROUP BY `key_press` ORDER BY `timestamp` DESC LIMIT 10000";

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getToExportAllDTMF(req: Request, res: Response, next: NextFunction) {
		console.log("campid", req.query)
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				// if (campid)
				// 	obj.qrysql = "SELECT COUNT(*) `calls`,  dl.`key_press` FROM `dialer_log` dl LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='"+ campid + "' AND dl.key_press!='' AND cc.campaign_type='DTMF Capture' GROUP BY dl.`key_press` ORDER BY dl.`timestamp` DESC ";
				// else
				// 	obj.qrysql = "SELECT COUNT(*) `calls`,  dl.`key_press` FROM `dialer_log` dl LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.`iduser`='"+ sessdata.id +"' AND dl.key_press!='' AND cc.campaign_type='DTMF Capture' GROUP BY dl.`key_press` ORDER BY dl.`timestamp` DESC LIMIT 10000";

				if (campid)
					obj.qrysql = "SELECT COUNT(*) `calls`,  `key_press` FROM `dialer_log` WHERE `idcampaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' AND key_press!='' GROUP BY `key_press` ORDER BY `timestamp` DESC";
				else
					obj.qrysql = "SELECT COUNT(*) `calls`,  `key_press` FROM `dialer_log` WHERE `iduser`='" + sessdata.id + "' AND key_press!='' GROUP BY `key_press` ORDER BY `timestamp` DESC LIMIT 10000";

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}


	public getForSMSData(req: Request, res: Response, next: NextFunction) {
		console.log("campid", req.query)
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT ss.dialed_number, ss.phone, ss.templateID, ss.status, ss.create_at, ss.key_press, ss.message, cc.campaign_type FROM `cel_sent_sms` ss INNER JOIN `cel_campaigns` cc  ON ss.id_campaign=cc.id WHERE ss.iduser='" + sessdata.id + "'AND ss.id_campaign='" + campid + "' ORDER BY ss.id DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT ss.dialed_number, ss.phone, ss.templateID, ss.status, ss.create_at, ss.key_press, ss.message, cc.campaign_type FROM `cel_sent_sms` ss INNER JOIN `cel_campaigns` cc  ON ss.id_campaign=cc.id WHERE ss.iduser='" + sessdata.id + "' ORDER BY ss.id DESC LIMIT 10000";

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getForALLSMSData(req: Request, res: Response, next: NextFunction) {
		console.log("campid", req.query)
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT ss.dialed_number, ss.phone, ss.templateID, ss.status, ss.create_at, ss.key_press, ss.message, cc.campaign_type FROM `cel_sent_sms` ss INNER JOIN `cel_campaigns` cc  ON ss.id_campaign=cc.id WHERE ss.iduser='" + sessdata.id + "'AND ss.id_campaign='" + campid + "'";
				else
					obj.qrysql = "SELECT ss.dialed_number, ss.phone, ss.templateID, ss.status, ss.create_at, ss.key_press, ss.message, cc.campaign_type FROM `cel_sent_sms` ss INNER JOIN `cel_campaigns` cc  ON ss.id_campaign=cc.id WHERE ss.iduser='" + sessdata.id + "' LIMIT 10000";

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getFilterForMisscallSummary(req: Request, res: Response, next: NextFunction) {
		console.log(req.query)
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `misscall`,  `create_at` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `id_account`='" + sessdata.idaccount + "' GROUP BY `create_at` ORDER BY `id` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT COUNT(*) `misscall`,  `create_at` FROM `cel_sent_sms` WHERE `id_account`='" + sessdata.idaccount + "' GROUP BY `create_at` ORDER BY `id` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public allget(req: Request, res: Response, next: NextFunction) {
		console.log(req.query)
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `misscall`,  `create_at` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `id_account`='" + sessdata.idaccount + "' GROUP BY `create_at`";
				else
					obj.qrysql = "SELECT COUNT(*) `misscall`,  `create_at` FROM `cel_sent_sms` WHERE `id_account`='" + sessdata.idaccount + "' GROUP BY `create_at` LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getFilterForMisscallSummarySms(req: Request, res: Response, next: NextFunction) {
		console.log(req.query)
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `sms_sent`,  `create_at` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `id_account`='" + sessdata.idaccount + "' GROUP BY `create_at` ORDER BY `id` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT COUNT(*) `sms_sent`,  `create_at` FROM `cel_sent_sms` WHERE `id_account`='" + sessdata.idaccount + "' GROUP BY `create_at` ORDER BY `id` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public allget2(req: Request, res: Response, next: NextFunction) {
		console.log(req.query)
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `sms_sent`,  `create_at` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `id_account`='" + sessdata.idaccount + "' GROUP BY `create_at`";
				else
					obj.qrysql = "SELECT COUNT(*) `sms_sent`,  `create_at` FROM `cel_sent_sms` WHERE `id_account`='" + sessdata.idaccount + "' GROUP BY `create_at` LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getSMSsummery(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `sms`, `key_press` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `key_press` ORDER BY id DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT COUNT(*) `sms`, `key_press` FROM `cel_sent_sms` WHERE `iduser`='" + sessdata.id + "' GROUP BY `key_press` ORDER BY id DESC LIMIT 10000";

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getForALLsummeryRepot(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `sms`, `key_press` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `key_press`";
				else
					obj.qrysql = "SELECT COUNT(*) `sms`, `key_press` FROM `cel_sent_sms` WHERE `iduser`='" + sessdata.id + "' GROUP BY `key_press` LIMIT 10000";

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getSMSdetailed(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);

				if (campid) {
					obj.qrysql = "SELECT ss.dialed_number, ss.phone, ss.templateID, ss.status, ss.create_at, ss.key_press, ss.message, cc.campaign_type FROM `cel_sent_sms` ss INNER JOIN `cel_campaigns` cc ON ss.id_campaign = cc.id WHERE `ss.id_campaign` = '" + campid + "' AND `ss.iduser` = '" + sessdata.id + "'";
				} else {
					obj.qrysql = "SELECT ss.dialed_number, ss.phone, ss.templateID, ss.status, ss.create_at, ss.key_press, ss.message, cc.campaign_type FROM `cel_sent_sms` ss INNER JOIN `cel_campaigns` cc ON ss.id_campaign = cc.id WHERE `ss.iduser` = '" + sessdata.id + "'";
				}

				// if (campid)
				// 	obj.qrysql = "SELECT ss.dialed_number, ss.phone, ss.templateID, ss.status, ss.create_at, ss.key_press, ss.message, cc.campaign_type FROM `cel_sent_sms` ss INNER JOIN   `cel_campaigns` cc    ON ss.id_campaign = cc.id  WHERE `ss.id_campaign`='" + campid + "' AND `ss.iduser`='" + sessdata.id + "' `";
				// else
				// 	obj.qrysql = "SELECT ss.dialed_number, ss.phone, ss.templateID, ss.status, ss.create_at, ss.key_press, ss.message, cc.campaign_type FROM `cel_sent_sms` ss INNER JOIN   `cel_campaigns` cc ON ss.id_campaign = cc.id WHERE `ss.iduser`='" + sessdata.id + "' `";

				// obj.qrysql =   "SELECT ss.dialed_number, ss.phone, ss.templateID, ss.status, ss.create_at, ss.key_press, ss.message, cc.campaign_type FROM `cel_sent_sms` ss INNER JOIN   `cel_campaigns` cc    ON ss.id_campaign = cc.id WHERE ss.iduser = '24'"

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public forTTSReportSms(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `sms`,  `key_press` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `key_press`  ORDER BY `id` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT COUNT(*) `sms`,  `key_press` FROM `cel_sent_sms` WHERE `iduser`='" + sessdata.id + "' AND `id_campaign` IN (SELECT `id` FROM `cel_campaigns` WHERE `campaign_type`='TTS' AND `is_deleted`='0' AND `iduser`='" + sessdata.id + "') GROUP BY `key_press`  ORDER BY `id` DESC LIMIT 10000";

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getForAllTTSReportSMS(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `sms`,  `key_press` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `key_press`";
				else
					obj.qrysql = "SELECT COUNT(*) `sms`,  `key_press` FROM `cel_sent_sms` WHERE `iduser`='" + sessdata.id + "' AND `id_campaign` IN (SELECT `id` FROM `cel_campaigns` WHERE `campaign_type`='TTS' AND `is_deleted`='0' AND `iduser`='" + sessdata.id + "') GROUP BY `key_press` LIMIT 10000";

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public forTTSReportCalls(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `calls`,  `key_press` FROM `dialer_log` WHERE `idcampaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `key_press`  ORDER BY `id` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT COUNT(*) `calls`,  `key_press` FROM `dialer_log` WHERE `iduser`='" + sessdata.id + "' AND `idcampaign` IN (SELECT `id` FROM `cel_campaigns` WHERE `campaign_type`='TTS' AND `is_deleted`='0' AND `iduser`='" + sessdata.id + "') GROUP BY `key_press`  ORDER BY `id` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getForALlTTSReportCalls(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `calls`,  `key_press` FROM `dialer_log` WHERE `idcampaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `key_press`";
				else
					obj.qrysql = "SELECT COUNT(*) `calls`,  `key_press` FROM `dialer_log` WHERE `iduser`='" + sessdata.id + "' AND `idcampaign` IN (SELECT `id` FROM `cel_campaigns` WHERE `campaign_type`='TTS' AND `is_deleted`='0' AND `iduser`='" + sessdata.id + "') GROUP BY `key_press` LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public forCountMisscalls(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);

				if (campid)
					obj.qrysql = "SELECT COUNT(*) `misscall`,  `create_at` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `create_at` ORDER BY `id` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT COUNT(*) `misscall`,  `create_at` FROM `cel_sent_sms` WHERE `iduser`='" + sessdata.id + "' AND `id_campaign` IN (SELECT `id` FROM `cel_campaigns` WHERE `campaign_type`='Misscall' AND `is_deleted`='0' AND `iduser`='" + sessdata.id + "') GROUP BY `create_at` ORDER BY `id` DESC LIMIT 10000";

				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getForAllMisscalls(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `misscall`,  `create_at` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `create_at`";
				else
					obj.qrysql = "SELECT COUNT(*) `misscall`,  `create_at` FROM `cel_sent_sms` WHERE `iduser`='" + sessdata.id + "' AND `id_campaign` IN (SELECT `id` FROM `cel_campaigns` WHERE `campaign_type`='Misscall' AND `is_deleted`='0' AND `iduser`='" + sessdata.id + "') GROUP BY `create_at` LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public forCountSMS(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `sms_sent`,  `create_at` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `create_at` ORDER BY `id` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT COUNT(*) `sms_sent`,  `create_at` FROM `cel_sent_sms` WHERE `iduser`='" + sessdata.id + "' AND `id_campaign` IN (SELECT `id` FROM `cel_campaigns` WHERE `campaign_type`='Misscall' AND `is_deleted`='0' AND `iduser`='" + sessdata.id + "') GROUP BY `create_at` ORDER BY `id` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getForALLSMSDataValuesss(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `sms_sent`,  `create_at` FROM `cel_sent_sms` WHERE `id_campaign`='" + campid + "' AND `iduser`='" + sessdata.id + "' GROUP BY `create_at`";
				else
					obj.qrysql = "SELECT COUNT(*) `sms_sent`,  `create_at` FROM `cel_sent_sms` WHERE `iduser`='" + sessdata.id + "' AND `id_campaign` IN (SELECT `id` FROM `cel_campaigns` WHERE `campaign_type`='Misscall' AND `is_deleted`='0' AND `iduser`='" + sessdata.id + "') GROUP BY `create_at` LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getDatadtmfDetailes(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime, dl.sip_status, dl.pulse, cd.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' ORDER BY dl.`call_time` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime, dl.sip_status, dl.pulse, cd.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.iduser='" + sessdata.id + "' AND cc.campaign_type='DTMF Capture' ORDER BY dl.`call_time` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getToAllExportDetailes(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime, dl.sip_status, dl.pulse, cd.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' ORDER BY dl.`call_time` DESC";
				else
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime, dl.sip_status, dl.pulse, cd.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.iduser='" + sessdata.id + "' AND cc.campaign_type='DTMF Capture' ORDER BY dl.`call_time` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}


	public getDtmfNoDetailes(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body;
		let campid = sdata.data[0];
		let dtmfNo = sdata.data[1];
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.prepare();
				obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime, dl.sip_status, dl.pulse, cd.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' AND dl.key_press='" + dtmfNo + "' ORDER BY dl.`call_time` DESC LIMIT 10000";
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getAllNoDetailes(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body;
		let campid = sdata.data[0];
		let dtmfNo = sdata.data[1];
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime, dl.sip_status, dl.pulse, cd.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' AND dl.key_press='" + dtmfNo + "' ORDER BY dl.`call_time` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getAllOnlyVoiceDetails(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					// obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, cd.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' ORDER BY dl.`id` DESC LIMIT 10000";
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, dl.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' ORDER BY dl.`id` DESC LIMIT 10000";
				else
					// obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, cd.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.iduser='" + sessdata.id + "' AND cc.campaign_type='Only Voice' ORDER BY dl.`id` DESC LIMIT 10000";
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, dl.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl  LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.iduser='" + sessdata.id + "' AND cc.campaign_type='Only Voice' ORDER BY dl.`id` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getVoiceTransferDeatiles(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press`dtmf`, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, dl.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl  LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' AND cc.campaign_type='Voice Transfer' ORDER BY dl.`id` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press`dtmf`, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, dl.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl  LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.iduser='" + sessdata.id + "' AND cc.campaign_type='Voice Transfer' ORDER BY dl.`id` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getForAllonlyVoiceTransfer(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press`dtmf`, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, dl.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl  LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' AND cc.campaign_type='Voice Transfer' ORDER BY dl.`id` DESC";
				else
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press`dtmf`, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, dl.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl  LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.iduser='" + sessdata.id + "' AND cc.campaign_type='Voice Transfer' ORDER BY dl.`id` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getVoiceTransferSummary(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `calls`,  dl.`key_press` FROM `dialer_log` dl LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' AND dl.key_press!='' AND cc.campaign_type='Voice Transfer' GROUP BY dl.`key_press` ORDER BY dl.`timestamp` DESC LIMIT 10000";
				else
					obj.qrysql = "SELECT COUNT(*) `calls`,  dl.`key_press` FROM `dialer_log` dl LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.`iduser`='" + sessdata.id + "' AND dl.key_press!='' AND cc.campaign_type='Voice Transfer' GROUP BY dl.`key_press` ORDER BY dl.`timestamp` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getForAllonlyVoicesummary(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT COUNT(*) `calls`,  dl.`key_press` FROM `dialer_log` dl LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' AND dl.key_press!='' AND cc.campaign_type='Voice Transfer' GROUP BY dl.`key_press` ORDER BY dl.`timestamp` DESC";
				else
					obj.qrysql = "SELECT COUNT(*) `calls`,  dl.`key_press` FROM `dialer_log` dl LEFT JOIN `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.`iduser`='" + sessdata.id + "' AND dl.key_press!='' AND cc.campaign_type='Voice Transfer' GROUP BY dl.`key_press` ORDER BY dl.`timestamp` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public getForAllonlyVoice(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					// obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, cd.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "'";
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, dl.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl  LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.idcampaign='" + campid + "' ORDER BY dl.`id` DESC";
				else
					obj.qrysql = "SELECT dl.idcampaign, dl.call_time, dl.key_press, dl.duration, dl.starttime, dl.endtime,dl.sip_status, dl.pulse, dl.did, cl.phone_no, cc.campaign_type  FROM `dialer_log` dl LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id  WHERE dl.iduser='" + sessdata.id + "' AND cc.campaign_type='Only Voice' ORDER BY dl.`id` DESC LIMIT 10000";
				// obj.qrysql = "SELECT idcampaign, call_time, key_press, duration, starttime, endtime, sip_status, pulse, did, `phone` `phone_no`, campaign_type FROM dialer_log WHERE iduser='"+ sessdata.id +"' AND campaign_type='Only Voice'  ORDER BY id DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}


	public forDeatilesTTSRep(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT dl.call_time, cd.did, cl.phone_no, dl.key_press , cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE cc.id='" + campid + "' AND cc.campaign_type='TTS' ORDER BY dl.`id` DESC LIMIT 10000 ";
				else
					obj.qrysql = "SELECT dl.call_time, cd.did, cl.phone_no, dl.key_press , cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.iduser='" + sessdata.id + "' AND cc.campaign_type='TTS' ORDER BY dl.`id` DESC LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public forAllDeatilesTTS(req: Request, res: Response, next: NextFunction) {
		let campid: any = (req.query.type != "main" && req.query.type != undefined) ? req.query.type : "";
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (campid)
					obj.qrysql = "SELECT dl.call_time, cd.did, cl.phone_no, dl.key_press , cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE cc.id='" + campid + "' AND cc.campaign_type='TTS' ";
				else
					obj.qrysql = "SELECT dl.call_time, cd.did, cl.phone_no, dl.key_press , cc.campaign_type  FROM `dialer_log` dl INNER JOIN  `cel_did` cd  ON dl.iddid=cd.id LEFT JOIN  `cel_leads` cl ON dl.idlead=cl.id LEFT JOIN  `cel_campaigns` cc ON dl.idcampaign=cc.id WHERE dl.iduser='" + sessdata.id + "' AND cc.campaign_type='TTS' LIMIT 10000";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Report loaded successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 404, message: "No data found!", data: [] });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		});
	}

	public ttsAPI(req: Request, res: Response, next: NextFunction) {
		let brandID = req.body.data;
		console.log("data is here :::", brandID);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				if (sessdata.authkey.length > 0) {
					let campregidata: any = {
						content: brandID
					}
					// Calculate the size of the text in bytes
					let textSizeInBytes = brandID.length * 2;

					// Convert the size to megabytes
					let textSizeInMB = textSizeInBytes / (1024 * 1024);
					const roundedNumber = textSizeInMB.toFixed(3);
					var request = require('request');
					var options = {
						rejectUnauthorized: false,
						method: 'POST',
						url: 'https://air.celetel.com/tts-api',
						body: JSON.stringify(campregidata),
						headers: {
							'Authorization': sessdata.authkey,
							'Content-Type': 'application/json'
						}
					};
					request(options, function (error: any, response: any, body: any) {
						if (!error) {
							let resdata: any = (response.body)
							const segments = resdata.split("/");
							const fileName = segments[segments.length - 1].trim();
							console.log("shivam::", fileName)
							if (resdata) {
								let obja = new ModelRawNonQuery(req, res);
								obja.nonqrysql = `INSERT INTO cel_uploads_voice(iduser,filename,file_type,audio, filepath, status, size) VALUES ('${sessdata.id}', '${fileName}','${'text_file'}','${fileName}', '/var/www/html/tts/','2', '${roundedNumber}')`;
								obja.prepare()
								obja.execute((error: number, udata: any) => {
									let lastId = udata.insertId;
									let objv = new RawView(res);
									objv.prepare({ message: "Text Genrate Successfully ", fileName, resdata, lastId });
									objv.execute();
								});
							}
							else {
								let objv = new RawView(res);
								objv.prepare({ message: resdata.message });
								objv.execute();
							}
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ message: "Something went Wrong" });
							objv.execute();
						}
					});
				} else {
					let objv = new RawView(res);
					objv.prepare({ message: "Authentication Failed!" });
					objv.execute();
				}
			} else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		})
	}



	// public ttsAPI(req: Request, res: Response, next: NextFunction) {
	//     const brandID = req.body?.data?.text; // Safely access nested properties
	//     console.log("brandID:", brandID);

	//     // Assuming SessionManagement, RawView, and Res406 classes are correctly defined

	//     // Handle missing brandID
	//     if (!brandID) {
	//         const objv = new Res406(res);
	//         objv.prepare("Missing brandID in the request");
	//         objv.execute();
	//         return; // Exit the function early
	//     }

	//     const session = new SessionManagment(req, res, next);
	//     session.GetSession((error: any, sessdata: any) => {
	//         if (error) {
	//             const objv = new Res406(res);
	//             objv.prepare("Error retrieving session data");
	//             objv.execute();
	//         } else {
	//             // Assuming sessdata.authkey is the authorization token

	//             // Check if authkey exists and is a non-empty string
	//             if (sessdata.authkey.length > 0) {
	//                 const campregidata: any = {
	//                     brandId: brandID
	//                 };

	//                 console.log("Campaign data888:", campregidata);

	//                 // Assuming you are using a modern HTTP library like Axios instead of 'request'
	//                 const axios = require('axios');
	//                 axios.post('https://air.celetel.com/tts-api/', campregidata, {
	//                     headers: {
	//                         'Content-Type': 'application/json',
	//                         'Authorization': sessdata.authkey
	//                     }
	//                 })
	//                 .then((response: any) => {
	//                     const resdata = response.data;
	//                     console.log('TTS API Response:', resdata);

	//                     const objv = new RawView(res);
	//                     objv.prepare({ message: resdata.message });
	//                     objv.execute();
	//                 })
	//                 .catch((error: any) => {
	//                     console.error('TTS API Error:', error);
	//                     const objv = new RawView(res);
	//                     objv.prepare({ message: "Something went wrong with the TTS API" });
	//                     objv.execute();
	//                 });
	//             } else {
	//                 const objv = new RawView(res);
	//                 objv.prepare({ message: "Authentication Failed!" });
	//                 objv.execute();
	//             }
	//         }
	//     });
	// }


}


