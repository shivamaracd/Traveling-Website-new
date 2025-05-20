import { Request, Response, NextFunction } from "express";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { RawView } from "../lib/view/RawView";
import { Res406 } from "../lib/view/406";

export class Credit {
	constructor() { }

	public getCreditData(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let sdata = req.body.data;
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = "SELECT * FROM cel_credit_history WHERE iduser = '" + sessdata.id + "' ORDER BY id DESC";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, message: "Successfully Fetched!", data: result });
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

	public creditRequest(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log('Request form value:', sdata)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = `INSERT INTO cel_credit_history(iduser,amount) VALUES ('${sessdata.id}', ${sdata.amount})`;
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ error: 0, message: "Successfully request send", data: result });
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


	public getcampaignpassbook(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (sessdata.type == 2) {
					obj.qrysql = "SELECT  cu.username,cu.idaccount, ccp.cost, ccp.id, ccp.date_time, ccp.campaign_id, ccp.campaign_name, ccp.iduser , cc.id_plan , cp.plan_name FROM `cel_campaign_passbook` ccp INNER JOIN  `cel_campaigns` cc  ON ccp.campaign_id=cc.id LEFT JOIN `cel_plan` cp ON cc.id_plan=cp.id LEFT JOIN `cel_users` cu ON ccp.iduser=cu.id WHERE cu.idaccount = '" + sessdata.idaccount + "' ORDER BY ccp.id DESC";
				} else {
					obj.qrysql = "SELECT ccp.cost, ccp.id, ccp.date_time, ccp.campaign_id, ccp.campaign_name, ccp.iduser , cc.id_plan , cp.plan_name FROM `cel_campaign_passbook` ccp INNER JOIN  `cel_campaigns` cc  ON ccp.campaign_id=cc.id LEFT JOIN `cel_plan` cp ON cc.id_plan=cp.id  WHERE ccp.iduser = '" + sessdata.id + "'";
				}
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ error: 0, message: "Fetch successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ message: "Something went wrong" });
						objv.execute();
					}
				})
			} else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		})
	}

	public getDatefitercampaignpassbook(req: Request, res: Response, next: NextFunction) {
		let sdata=req.body.data;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (sessdata.type == 2) {
					obj.qrysql = "SELECT  cu.username,cu.idaccount, ccp.cost, ccp.id, ccp.date_time, ccp.campaign_id, ccp.campaign_name, ccp.iduser , cc.id_plan , cp.plan_name FROM `cel_campaign_passbook` ccp 	INNER JOIN  `cel_campaigns` cc  ON ccp.campaign_id=cc.id LEFT JOIN `cel_plan` cp ON cc.id_plan=cp.id LEFT JOIN `cel_users` cu ON ccp.iduser=cu.id WHERE cu.idaccount = '56' AND DATE_FORMAT(`date_time`, '%Y-%m-%d')>='"+sdata.startdate+"' AND DATE_FORMAT(`date_time`, '%Y-%m-%d')<='"+sdata.enddate+"' ORDER BY ccp.id DESC";
				}
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ error: 0, message: "Fetch successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ message: "Something went wrong" });
						objv.execute();
					}
				})
			} else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		})
	}

	public getDatefiterUsername(req: Request, res: Response, next: NextFunction) {
		let sdata=req.body.data;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawQuery(req, res);
				if (sessdata.type == 2) {
					obj.qrysql = "SELECT  cu.username,cu.idaccount, ccp.cost, ccp.id, ccp.date_time, ccp.campaign_id, ccp.campaign_name, ccp.iduser , cc.id_plan , cp.plan_name FROM `cel_campaign_passbook` ccp INNER JOIN  `cel_campaigns` cc  ON ccp.campaign_id=cc.id LEFT JOIN `cel_plan` cp ON cc.id_plan=cp.id LEFT JOIN `cel_users` cu ON ccp.iduser=cu.id WHERE cu.idaccount = '"+sessdata.idaccount+"' AND cu.username='"+sdata+"' ORDER BY ccp.id DESC";
				}
				obj.prepare();
				obj.execute((error: any, result: any) => {
					if (result) {
						let objv = new RawView(res);
						objv.prepare({ error: 0, message: "Fetch successfully", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ message: "Something went wrong" });
						objv.execute();
					}
				})
			} else {
				let objv = new Res406(res);
				objv.prepare("No session data there");
				objv.execute();
			}
		})
	}
}