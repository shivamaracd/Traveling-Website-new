import { Request, Response, NextFunction } from "express";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";
import { sendMail } from './email';
import { ModelOtherUpload } from "../lib/model/ModelOthersUpload";

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length: any) {
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

export class Executive {
	constructor() { }

	/* Manage Executive Start*/
	public saveexcutive(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		let extname = generateString(8);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawNonQuery(req, res);
				objs.nonqrysql = `INSERT INTO agents(iduser,idaccount, first_name, last_name, email, phoneno,  username, password, name, islogin, sendemail, system, type, status, state, contact) VALUES ('${sessdata.id}', '${sessdata.idaccount}', '${sdata.first_name}', '${sdata.last_name}','${sdata.email}', '${sdata.phoneno}', '${sdata.username}', '${sdata.password}', '${extname}', ${sdata.islogin}, ${sdata.sendemail}, 'single_box', 'callback', 'Never Logged In','Waiting', '{sip_h_X-presence_id=${'presence_id'},sip_h_X-presence_data=${'presence_data'},sip_h_X-accountcode=${'accountcode'}}user/${extname}' )`;
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Executives Created Successfully" });
						objv.execute();
						if (sdata.sendemail) {
							sendMail(sdata);
						}
					}
					else {
						console.log(error, result.sqlMessage)
						let objv = new RawView(res);
						objv.prepare({ status: 502, message: result.sqlMessage });
						objv.execute();
					}

				});
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No seesion found!");
				objv.execute();
			}
		});

	}
	/* Manage Executive End*/

	/* Manage Executive Group Start */

	public createGroup(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		let obj = new ModelRawQuery(req, res);
		let gname = Math.random().toString(36).slice(2);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				obj.qrysql = `INSERT INTO cel_groups(iduser, name, description, groupname) VALUES ('${sessdata.id}', '${sdata.name}', '${sdata.description}','${gname}')`;
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Group Created Successfully" });
						objv.execute();
					}
					else if (error && error.code === 'ER_DUP_ENTRY') {
						let objv = new RawView(res);
						objv.prepare({ status: 409, message: "duplicate entry" });
						objv.execute();
					} else if (error) {
						console.log(error);
						let objv = new RawView(res);
						objv.prepare({ status: 502, message: "Group Name already exist" });
						objv.execute();
					}
				})
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session Found!");
				objv.execute();
			}
		});

	}

	public executiveMapping(req: Request, res: Response, next: NextFunction) {
		let mdata = req.body.data;
		let exelist = mdata.mappedexe;
		console.log("mdata", mdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "UPDATE `cel_groups` SET exuctive_count = '" + mdata.totalexe + "',exuctivename = '" + JSON.stringify(mdata.newList) + "' WHERE id = '" + mdata.idgroup + "'  AND iduser = '" + sessdata.id + "'";
				obj.prepare();
				obj.execute((error, result1) => {
					let obj1 = new ModelRawQuery(req, res);
					obj1.qrysql = "SELECT groupname FROM `cel_groups` WHERE id=" + mdata.idgroup;
					obj1.prepare();
					obj1.execute((error: any, reggroup: any) => {
						let obj2 = new ModelRawNonQuery(req, res);
						obj2.nonqrysql = "DELETE FROM `tiers` WHERE `queue`='" + reggroup[0].groupname + "' AND iduser = '" + sessdata.id + "'";
						obj2.prepare();
						obj2.execute((error, result1) => {
							for (let i = 0; i < exelist.length; i++) {
								let obj3 = new ModelRawQuery(req, res);
								obj3.qrysql = "SELECT `name` FROM `agents` WHERE `id`=" + exelist[i];
								obj3.prepare();
								obj3.execute((error: any, agres: any) => {
									let obj4 = new ModelRawNonQuery(req, res);
									obj4.nonqrysql = `INSERT INTO tiers(iduser, agent, queue, state, idagent, id_agentgroup) VALUES ('${sessdata.id}', '${agres[0].name}', '${reggroup[0].groupname}', 'Ready', '${exelist[i]}', '${mdata.idgroup}')`;
									obj4.prepare()
									obj4.execute((error: number, udata: any) => { });
								});
							}
							if (result1) {
								let obj4 = new RawView(res);
								obj4.prepare({ message: "Executive Updated Successfully" });
								obj4.execute();
							} else {
								let objv = new RawView(error);
								objv.prepare({ status: 500, message: "Something went wrong" });
								objv.execute();
							}
						});
					});
				});
			} else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}

		});
	}


	public getExective(req: Request, res: Response, next: NextFunction) {
		console.log("mdata", req.body.data);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "SELECT  cat.idgroup, a.username, a.first_name FROM `cel_agent_team` cat INNER JOIN `agents` a ON cat.idagent=a.id WHERE cat.idgroup='" + req.body.data + "'";
				obj.prepare();
				obj.execute((error, result1) => {
					let objv = new RawView(res);
					objv.prepare({ message: "list Get Successfully", data: result1 });
					objv.execute();
				})
			} else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}

		});
	}

	updateWithStatus(req: Request, res: Response, next: NextFunction) {
		console.log("mdata", req.body.data);
		let value = JSON.stringify("{sip_h_X-presence_id=presence_id,sip_h_X-presence_data=presence_data,sip_h_X-accountcode=accountcode}sofia/gateway/celdialer/8279#1" + req.body.data.phoneno )
		
		let value1 = JSON.stringify("{sip_h_X-presence_id=presence_id,sip_h_X-presence_data=presence_data,sip_h_X-accountcode=accountcode}user/" + req.body.data.phoneno )
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				if (req.body.data.isactive == 1) {
					let obj = new ModelRawNonQuery(req, res);
					obj.nonqrysql = "UPDATE agents SET contact=" + value +", status ='" + req.body.data.status +"', isactive = '" + req.body.data.isactive+"'  WHERE id= '" +req.body.data.id+ "'"; 
					obj.prepare();
					obj.execute((error: any, resultfsdf: any) => {
						if (resultfsdf) {
							let objv = new RawView(res)
							objv.prepare({ error: 1, message: "Status Update Successfully.", data: resultfsdf })
							objv.execute()
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ message: "Something went wrong" });
							objv.execute();
						}
					})
				} else {
					let obj = new ModelRawNonQuery(req, res);
					obj.nonqrysql = "UPDATE agents SET contact=" + value1 +", status ='" + req.body.data.status +"', isactive = '" + req.body.data.isactive+"'  WHERE id= '" +req.body.data.id+ "'"; 
					obj.prepare();
					obj.execute((error: any, resultfsdf: any) => {
						if (resultfsdf) {
							let objv = new RawView(res)
							objv.prepare({ error: 1, message: "Status Update Successfully.", data: resultfsdf })
							objv.execute()
						}
						else {
							let objv = new RawView(res);
							objv.prepare({ message: "Something went wrong" });
							objv.execute();
						}
					})
				}

			} else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}

		});
	}


	public deleteExeGroup(req: Request, res: Response, next: NextFunction) {
		let idss = (req.query.id != null && req.query.id != undefined) ? req.query.id : 0;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "SELECT idaction, id_campaign, action, description FROM cel_action WHERE idaction='" + idss + "' AND iduser = '" + sessdata.id + "'"
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result[0] === undefined) {
						obj.nonqrysql = "DELETE FROM `cel_groups` WHERE id='" + idss + "' AND iduser = '" + sessdata.id + "'"
						obj.prepare();
						obj.execute((error: any, result: any) => {
							if (error == 1) {
								obj.nonqrysql = "DELETE FROM `cel_agent_team` WHERE idgroup='" + idss + "' AND iduser = '" + sessdata.id + "'";
								obj.prepare();
								obj.execute((error, result1) => {
									let objv = new RawView(res);
									objv.prepare({ error: 1, message: "Executive Group Deleted Successfully." });
									objv.execute();
								});
							}
						});
					} else {
						let objv = new RawView(res)
						objv.prepare({ error: 0, message: "Executive Group assigned with Campaign!", data: result })
						objv.execute()
					}
				});
			}
			else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}
		});
	}


	public deleteExecutive(req: Request, res: Response, next: NextFunction) {
		let id = (req.query.id != null && req.query.id != undefined) ? req.query.id : 0;
		let idss = Number(id);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "SELECT idagent FROM `tiers` WHERE iduser = '" + sessdata.id + "'";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					const agentArray = result.map((row: { idagent: any; }) => Number(row.idagent));
					const unmatchedData = [];
					if (!agentArray.includes(idss)) {
						unmatchedData.push(idss);
					}
					if (unmatchedData.length > 0) {
						const objv = new RawView(res);
						objv.prepare({ status: 200 });
						objv.execute();
					} else {
						const objv = new RawView(res);
						objv.prepare({ status: 400, message: "Executive assigned with group" });
						objv.execute();
					}
				});
			}
			else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}
		});
	}



	public deleteSMS(req: Request, res: Response, next: NextFunction) {
		let id = (req.query.id != null && req.query.id != undefined) ? req.query.id : 0;
		let idss = Number(id);
		let session = new SessionManagment(req, res, next);

		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "SELECT idaction, id_campaign, action, description FROM cel_action WHERE iduser = '" + sessdata.id + "'";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					const agentArray = result.map((row: { idaction: any; }) => Number(row.idaction));
					const unmatchedData = [];
					if (!agentArray.includes(idss)) {
						unmatchedData.push(idss);
					}

					if (unmatchedData.length > 0) {
						obj.nonqrysql = "SELECT template_id, id FROM cel_campaigns WHERE iduser = '" + sessdata.id + "'";
						obj.prepare();
						obj.execute((error: any, campaignResult: any) => {
							const campaignIds = campaignResult.map((row: { template_id: any; }) => Number(row.template_id));
							if (campaignIds.includes(idss)) {
								const objv = new RawView(res);
								objv.prepare({ status: 400, message: "SMS assigned with campaign" });
								objv.execute();
							} else {
								const objv = new RawView(res);
								objv.prepare({ status: 200 });
								objv.execute();
							}
						});
					} else {
						const objv = new RawView(res);
						objv.prepare({ status: 400, message: "SMS assigned with campaign" });
						objv.execute();
					}
				});
			} else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}
		});
	}


	/* Manage Executive Group Stop */

	public uploadSound(req: Request, res: Response, next: NextFunction) {
		var sdata = req.body;
		let objfile = new ModelOtherUpload(req, res);
		let fdata: any = objfile.AudioUpload();
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = `INSERT INTO cel_ivr( iduser, file_name, description, filetype, name, audio) VALUES (${sessdata.id}, '${fdata[0]}', '${sdata.description}', '${sdata.type}', '${sdata.filename}', '${fdata[4]}' ) `;
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: `Sound file Inserted Successfully!`, data: result });
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: 502, message: `Sound file upload failed!`, data: {} });
						objv.execute();
					}
				});
			}
			else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		})

	}

	public setperdefault(req: Request, res: Response, next: NextFunction) {
		let sddata = req.body.data
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let iQry = "UPDATE `cel_ivr` SET `is_set`='1' WHERE `id`='" + sddata.formdata + "' AND iduser = '" + sessdata.id + "' AND filetype = '" + sddata.formtype + "'";
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = iQry;
				obj.prepare();
				obj.execute((error: any, result: any) => {
					let objv = new RawView(res);
					objv.prepare({ message: "Default Sound Added" });
					objv.execute();
				})
			} else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}
		});

	}

	public getfiletyprdata(req: Request, res: Response, next: NextFunction) {
		let ssdata = req.query.type;
		//console.log("ashwnai",req)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			if (sessdata.type == 2) {
				obj.qrysql = "SELECT cu.idaccount, cu.username, ci.id, ci.name, ci.file_name, ci.filetype, ci.description, ci.date_of_addition,ci.status, ci.is_set, ci.campaign_name, ci.created_at FROM `cel_ivr` ci INNER JOIN `cel_users` cu ON ci.iduser = cu.id  WHERE  cu.idaccount = '" + sessdata.idaccount + "' AND  ci.filetype = '" + ssdata + "'  ";
			} else {
				obj.qrysql = "SELECT `id`,`name`, `file_name`, `filetype`, `description`, `is_set`, `campaign_name`, `created_at` `date_of_addition`, `status`, `audio` FROM `cel_ivr`  WHERE  iduser = '" + sessdata.id + "' AND  filetype = '" + ssdata + "'  ";
			}
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, message: "Successfully fetched! ", data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		})

	}

	public getfiletyprdata2(req: Request, res: Response, next: NextFunction) {
		let ssdata = req.query.type;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			if (sessdata.type == 2) {
				obj.qrysql = "SELECT cu.idaccount, cu.username, ci.id, ci.name, ci.file_name, ci.filetype, ci.description, ci.date_of_addition,ci.status, ci.is_set, ci.campaign_name, ci.created_at FROM `cel_ivr` ci INNER JOIN `cel_users` cu ON ci.iduser = cu.id  WHERE  cu.idaccount = '" + sessdata.idaccount + "' ";
			} else {
				obj.qrysql = "SELECT `id`,`name`, `file_name`, `filetype`, `description`, `date_of_addition`, `is_set`, `campaign_name`, `created_at` FROM `cel_ivr`  WHERE  iduser = '" + sessdata.id + "'";
			}
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, message: "Successfully fetched! ", data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})
		})
	}

	public getfilterexuctive(req: Request, res: Response, next: NextFunction) {
		let ssdata = req.query.type;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			// obj.qrysql = "SELECT id, phoneno, username, first_name, last_name, created_at, status,email,country FROM agents WHERE executive_group_id ='" + ssdata + "' AND iduser = '" + sessdata.id + "'";
			obj.qrysql = " SELECT a.username, a.password, a.last_name, a.isactive, ca.iduser, ca.id_campaign, ca.idaction, t.idagent , a.phoneno, a.first_name, a.priority, a.created_at, a.status, a.id FROM `cel_action` ca INNER JOIN `tiers` t  ON ca.idaction=t.id_agentgroup LEFT JOIN `agents` a ON t.idagent=a.id WHERE ca.id_campaign='" + ssdata + "' AND ca.iduser = '" + sessdata.id + "' AND ca.action='transfertogroup' ";
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
		})
	}

	public getDatawithDate(req: Request, res: Response, next: NextFunction) {
		var sdata = req.body.data;
		console.log("userid", sdata)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "SELECT a.username, cl.phone_no, cd.did, ac.iddid, ac.lead_id, ac.agent, ac.queue, ac.id_campaign, ac.duration, ac.iduser, ac.start_stamp, ac.end_stamp FROM `cel_agent_cdr` ac INNER JOIN `cel_leads` cl ON ac.lead_id=cl.id LEFT JOIN `cel_did` cd ON ac.iddid=cd.id LEFT JOIN `agents` a ON ac.agent=a.name WHERE ac.iduser='" + sessdata.id + "' AND DATE(ac.start_stamp)='" + sdata + "' ";
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

	public getDatawithCompaign(req: Request, res: Response, next: NextFunction) {
		var sdata = req.body.data;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "SELECT a.username, cl.phone_no, cd.did, ac.iddid, ac.lead_id, ac.agent, ac.queue, ac.id_campaign, ac.duration, ac.iduser, ac.start_stamp, ac.end_stamp FROM `cel_agent_cdr` ac INNER JOIN `cel_leads` cl ON ac.lead_id=cl.id LEFT JOIN `cel_did` cd ON ac.iddid=cd.id LEFT JOIN `agents` a ON ac.agent=a.name WHERE ac.iduser='" + sessdata.id + "' AND ac.id_campaign='" + sdata + "' ";
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

	public getDatawithAgentss(req: Request, res: Response, next: NextFunction) {
		var sdata = req.body.data;
		console.log("userid", sdata)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "SELECT a.username, cl.phone_no, cd.did, ac.iddid, ac.lead_id, ac.agent, ac.queue, ac.id_campaign, ac.duration, ac.iduser, ac.start_stamp, ac.end_stamp FROM `cel_agent_cdr` ac INNER JOIN `cel_leads` cl ON ac.lead_id=cl.id LEFT JOIN `cel_did` cd ON ac.iddid=cd.id LEFT JOIN `agents` a ON ac.agent=a.name WHERE ac.iduser='" + sessdata.id + "' AND ac.agent='" + sdata + "' ";
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

	public getDatawithCallduration(req: Request, res: Response, next: NextFunction) {
		var sdata = req.body.data;
		console.log("userid", sdata)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "SELECT a.username, cl.phone_no, cd.did, ac.iddid, ac.lead_id, ac.agent, ac.queue, ac.id_campaign, ac.duration, ac.iduser, ac.start_stamp, ac.end_stamp FROM `cel_agent_cdr` ac INNER JOIN `cel_leads` cl ON ac.lead_id=cl.id LEFT JOIN `cel_did` cd ON ac.iddid=cd.id LEFT JOIN `agents` a ON ac.agent=a.name WHERE ac.iduser='" + sessdata.id + "' AND ac.duration >='" + sdata + "' ";
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

	public setsounddefault(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data
		console.log("fff", sdata)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let iQry = "UPDATE `cel_ivr` SET `is_set`=0 WHERE iduser = " + sessdata.id + " AND filetype = '" + sdata.atype + "'";
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = iQry;
				obj.prepare();
				obj.execute((error: any, result: any) => {
					let iQry = "UPDATE `cel_ivr` SET `is_set`=1 WHERE `id`=" + sdata.aid + " AND iduser = " + sessdata.id + " AND filetype = '" + sdata.atype + "' ";
					let objs = new ModelRawNonQuery(req, res);
					objs.nonqrysql = iQry;
					objs.prepare();
					objs.execute((error: any, result: any) => {
						let objv = new RawView(res);
						objv.prepare({ message: "Default Sound File Updated" });
						objv.execute();
					})
				})
			} else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}
		});

	}

	public deleteSound(req: Request, res: Response, next: NextFunction) {
		let id: any = req.query.id
		let obj = new ModelRawNonQuery(req, res);
		obj.nonqrysql = "DELETE FROM `cel_ivr` WHERE id='" + req.query.id + "'";
		obj.prepare();
		obj.execute((error: any, result: any) => {
			let objv = new RawView(res);
			objv.prepare({ message: "Deleted successfully." });
			objv.execute();
		});
	}

	public updateSound(req: Request, res: Response, next: NextFunction) {

		let data = req.body.data
		let obj = new ModelRawQuery(req, res);
		obj.qrysql = `UPDATE cel_ivr SET  name = '${data.filename}', description = '${data.description}'  WHERE `;
		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				let objv = new RawView(res);
				objv.prepare({ error: 0, message: "Sound data successfully updated ", data: result });
				objv.execute();
			}
			else {
				let objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	updateSet(req: Request, res: Response, next: NextFunction) {
		const data = req.body.data;
		const id = req.query.id;

		const obj = new ModelRawNonQuery(req, res);
		obj.nonqrysql = `UPDATE cel_ivr SET is_set = CASE
		  WHEN filetype = 'welcome audio' THEN
			CASE
			  WHEN id = ${id} THEN 1
			  ELSE 0
			END
		  ELSE is_set
		END WHERE filetype = 'welcome audio'`;

		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				const objv = new RawView(res);
				objv.prepare({ error: 0, message: "Welcome Sound Set successfully ", data: result });
				objv.execute();
			}
			else {
				const objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	holdupdate(req: Request, res: Response, next: NextFunction) {
		const data = req.body.data;
		const id = req.query.id;

		const obj = new ModelRawNonQuery(req, res);
		obj.nonqrysql = `UPDATE cel_ivr SET is_set = CASE
		  WHEN filetype = 'hold audio' THEN
			CASE
			  WHEN id = ${id} THEN 1
			  ELSE 0
			END
		  ELSE is_set
		END WHERE filetype = 'hold audio'`;

		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				const objv = new RawView(res);
				objv.prepare({ error: 0, message: "Hold Sound Set successfully", data: result });
				objv.execute();
			}
			else {
				const objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	busyset(req: Request, res: Response, next: NextFunction) {
		const data = req.body.data;
		const id = req.query.id;

		const obj = new ModelRawNonQuery(req, res);
		obj.nonqrysql = `UPDATE cel_ivr SET is_set = CASE
		  WHEN filetype = 'busy audio' THEN
			CASE
			  WHEN id = ${id} THEN 1
			  ELSE 0
			END
		  ELSE is_set
		END WHERE filetype = 'busy audio'`;

		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				const objv = new RawView(res);
				objv.prepare({ error: 0, message: "Busy Sound Set successfully", data: result });
				objv.execute();
			}
			else {
				const objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	voicemailset(req: Request, res: Response, next: NextFunction) {
		const data = req.body.data;
		const id = req.query.id;
		const obj = new ModelRawNonQuery(req, res);
		obj.nonqrysql = `UPDATE cel_ivr SET is_set = CASE
		  WHEN filetype = 'voice mail' THEN
			CASE
			  WHEN id = ${id} THEN 1
			  ELSE 0
			END
		  ELSE is_set
		END WHERE filetype = 'voice mail'`;

		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				const objv = new RawView(res);
				objv.prepare({ error: 0, message: "Voice Mail Sound Set successfully", data: result });
				objv.execute();
			}
			else {
				const objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	public deleteSoundFileData(req: Request, res: Response, next: NextFunction) {
		let id: any = req.query.id
		let obj = new ModelRawNonQuery(req, res);
		obj.nonqrysql = "DELETE FROM `cel_ivr` WHERE id='" + req.query.id + "'";
		obj.prepare();
		obj.execute((error: any, result: any) => {
			let objv = new RawView(res);
			objv.prepare({ message: "Sound file deleted successfully." });
			objv.execute();
		});
	}

	public updatecallhistory(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		let obj = new ModelRawQuery(req, res);
		obj.qrysql = `UPDATE cel_calls_history SET  remark = '${sdata.remark}'  WHERE `;
		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				let objv = new RawView(res);
				objv.prepare({ error: 0, message: "Successfully Updated", data: result });
				objv.execute();
			}
			else {
				let objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	public updatecrm(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data
		let obj = new ModelRawQuery(req, res);
		obj.qrysql = `UPDATE cel_leads SET remark = '${sdata.remark}' WHERE `;
		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				let objv = new RawView(res);
				objv.prepare({ error: 0, message: "Successfully Updated", data: result });
				objv.execute();
			}
			else {
				let objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	public getBlockListData(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = "SELECT * FROM cel_blocklist WHERE iduser = '" + sessdata.id + "'";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, message: "Successfully fetched all blocked data", data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})
		})
	}

	public changeAgentStatus(req: Request, res: Response, next: NextFunction) {
		let obj = new ModelRawQuery(req, res);
		obj.qrysql = `UPDATE cel_calls_history SET blocklist = '${req.body.data}'  WHERE `;
		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				let objv = new RawView(res);
				objv.prepare({ error: 0, message: "Agent Blocked Successfully", data: result });
				objv.execute();
			}
			else {
				let objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	public unblockStatus(req: Request, res: Response, next: NextFunction) {
		let obj = new ModelRawQuery(req, res);
		obj.qrysql = `UPDATE cel_calls_history SET status = '${req.body.data}'  WHERE `;
		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				let objv = new RawView(res);
				objv.prepare({ error: 0, message: "Agent unblocked Successfully", data: result });
				objv.execute();
			}
			else {
				let objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	public changeAgentStatusCRM(req: Request, res: Response, next: NextFunction) {
		let obj = new ModelRawQuery(req, res);
		obj.qrysql = `UPDATE cel_leads SET blocklist = '${req.body.data}'  WHERE `;
		obj.prepare();
		obj.execute((error: any, result: any) => {
			if (result) {
				let objv = new RawView(res);
				objv.prepare({ error: 0, message: "Successfully blocked a agent in crm", data: result });
				objv.execute();
			}
			else {
				let objv = new RawView(res);
				objv.prepare({ message: "Something went wrong" });
				objv.execute();
			}
		})
	}

	public blockAgent(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = `INSERT INTO cel_blocklist(iduser,customer_number, agent, call_time, call_duration, audio, campaign_name, disposition) VALUES ('${sessdata.id}','${sdata.customer_number}', '${sdata.agent}', '${sdata.call_time}', '${sdata.call_duration}' , '${sdata.audio}' , '${sdata.campaign_name}' , '${sdata.disposition}')`;
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, message: "Successfully added blocked agent", data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		})

	}

	public movecrmData(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = `INSERT INTO cel_leads(iduser,customer_name, priority, audio_name, disposition, agent_name, phone_no ) VALUES('${sessdata.id}','Customer1','1', 'Winning34', '${sdata.disposition}', 'First Name', '${sdata.customer_number}')`;
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, message: "Successfully added in CRM data", data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		})

	}

	public unBlockHistory(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = `INSERT INTO cel_calls_history(iduser,customer_number, agent, call_time, call_duration, status, audio, created_at, campaign_name, disposition ) VALUES ('${sessdata.id}','${sdata[0].id}','${sdata[0].customer_number}','${sdata[0].agent}','${sdata[0].call_time}','${sdata[0].call_duration}','${sdata[0].status}','${sdata[0].audio}','${sdata[0].created_at}','${sdata[0].campaign_name}','${sdata[0].disposition}' )`;
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, message: "Data Unblock Successfully ", data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})

		})

	}

	public getBlockItem(req: Request, res: Response, next: NextFunction) {
		let sValue : any = req.query.filter
		let credit_id: any = JSON.parse(sValue)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "SELECT * FROM cel_blocklist WHERE id='" + credit_id.id + "' AND iduser = '" + sessdata.id + "'"
				obj.prepare();
				obj.execute((error, result1) => {
					let objv = new RawView(res);
					objv.prepare({ message: "Block Item fetch.", records: result1 });
					objv.execute();
				});

			} else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}

		});
	}

	public getParticulerExcData(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			console.log(sessdata)
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				obj.qrysql = "SELECT a.username, cl.phone_no, cd.did, ac.iddid, ac.lead_id, ac.agent, ac.queue, ac.id_campaign, ac.duration, ac.iduser, ac.start_stamp, ac.end_stamp, DATE_FORMAT(ac.start_stamp, '%y-%m-%d')`date`, ac.id_call, ac.uuid FROM `cel_agent_cdr` ac INNER JOIN `cel_leads` cl ON ac.lead_id=cl.id LEFT JOIN `cel_did` cd ON ac.iddid=cd.id LEFT JOIN `agents` a ON ac.agent=a.name WHERE ac.iduser= '" + sessdata.id + "' ORDER BY ac.start_stamp DESC";
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


	public deleteCallHistoryItem(req: Request, res: Response, next: NextFunction) {
		let idss = req.query.id
		let obj = new ModelRawNonQuery(req, res);
		obj.nonqrysql = "DELETE FROM `cel_calls_history` WHERE id='" + idss + "'"
		obj.prepare();
		obj.execute((error: any, result: any) => {
			let objv = new RawView(res);
			objv.prepare({ message: "Call History Deleted Successfully." });
			objv.execute();
		});
	}

	public deleteBlockListItem(req: Request, res: Response, next: NextFunction) {
		let id: any = req.query.id
		let obj = new ModelRawNonQuery(req, res);
		obj.nonqrysql = "DELETE FROM `cel_blocklist` WHERE `id`=" + req.query.id + ";"
		obj.prepare();
		obj.execute((error: any, result: any) => {
			let objv = new RawView(res);
			objv.prepare({ message: "Deleted Successfully" });
			objv.execute();
		});
	}

	public getCrmData(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = "SELECT * FROM cel_leads WHERE iduser = '" + sessdata.id + "'";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, message: "Data Fetched Successfully", data: result });
					objv.execute();
				}
				else {
					let objv = new RawView(res);
					objv.prepare({ message: "Something went wrong" });
					objv.execute();
				}
			})
		})
	}


}
