import { Request, Response, NextFunction } from "express";
import { ModelCsvUpload } from "../lib/model/ModelCsvUpload";
// import { ModelOtherUpload } from "../lib/model/ModelOthersUpload";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";
const csv = require('csv-parser');
import fs from "fs"


export class Did {
	constructor() { }
    public getallaccount(req: Request, res: Response, next: NextFunction) {
		let sdata = req.query.type
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			// obj.qrysql = "SELECT id,idaccount,firstname,lastname,email,expiry,country,phone_number,call_broadcast,gender,website,campain_type,company_name,company,username,password,address,city,postal_code,created_at,status,did_count, plan, dnd FROM `cel_users`  WHERE type = '" + sdata + "' AND is_deleted ='0' ORDER BY id DESC";
			obj.qrysql = "SELECT ur.id,ur.idaccount,ur.firstname,ur.lastname,ur.email,ur.expiry,ur.country,ur.phone_number,ur.call_broadcast,ur.gender,ur.website,ur.campain_type,ur.company_name,ur.company,ur.username,ur.password,ur.address,ur.city,ur.postal_code,DATE_FORMAT(ur.`created_at`, '%Y-%m-%d') created_at,ur.status,ur.did_count, ur.plan, ur.dnd, ur.is_active ,al.company_name,al.did FROM `cel_users` ur LEFT JOIN `cel_account` al ON ur.idaccount=al.idaccount WHERE type = '" + sdata + "' AND ur.is_deleted ='0' ORDER BY id DESC"
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

	public didassigneddata(req: Request, res: Response, next: NextFunction) {
		let hdata = req.body.data.form;
		let ids = req.body.data.id;
		console.log("idusert", hdata, ids)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let diddata = hdata.didlist
			let obj = new ModelRawNonQuery(req, res);
			obj.nonqrysql = "UPDATE `cel_did` SET iduser = '" + hdata.companyids + "', free_status = '" + 1 + "' , user_details ='" + ids + "' WHERE `id` in  (" + diddata + ") ";
			obj.prepare();
			// obj.execute((error: any, result: any) => {
			// 	obj.nonqrysql = "UPDATE cel_users SET didcount = ((SELECT didcount FROM cel_users WHERE id = '" + hdata.companyids + "' LIMIT 1) + '" + diddata.length + "' ) WHERE id = '" + hdata.companyids + "'";
			// 	obj.prepare();
			// 	obj.execute((error: any, result: any) => { })
			// })
			obj.execute((error: any, result: any) => {
				obj.nonqrysql = "UPDATE cel_users SET did_count = ((SELECT did_count FROM cel_users WHERE id = '" + hdata.companyids + "' LIMIT 1) + '" + diddata.length + "' ) WHERE id = '" + hdata.companyids + "'";
				obj.prepare();
				obj.execute((error: any, result: any) => {
					let objv = new RawView(res);
					objv.prepare({ status: 200, message: "DID Assigned Successfully" });
					objv.execute();
				})
			})

		})
	}

	public getdiddatabyfilter(req: Request, res: Response, next: NextFunction) {
		let gdata = req.query.type
		console.log("LOOP", gdata)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawNonQuery(req, res);
			obj.nonqrysql = "SELECT id,did FROM cel_did WHERE iduser = '" + gdata + "'";
			obj.prepare();
			obj.execute((error: any, result: any) => {
				if (result) {
					let objv = new RawView(res);
					objv.prepare({ status: 200, message: "DID AssignData Successfully", data: result });
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

	public unassigneddiddata(req: Request, res: Response, next: NextFunction) {
		let hhdata = req.query.type
		console.log("LLLS", hhdata)
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			let obj = new ModelRawNonQuery(req, res);
			obj.nonqrysql = "SELECT iduser FROM `cel_did` WHERE id = '" + hhdata + "'";
			obj.prepare();
			obj.execute((error: any, results: any) => {
				let idaccount = results[0].iduser
				console.log("LLLS1", idaccount )
				obj.nonqrysql = "UPDATE cel_users SET did_count = ((SELECT did_count FROM cel_users WHERE id = '" + idaccount + "' LIMIT 1) - 1)  WHERE id = '" + idaccount + "' "
				obj.prepare();
				obj.execute((error: any, results: any) => { })
			})
			obj.execute((error: any, results: any) => {
				let idaccount = results[0].idaccount
				// obj.nonqrysql = "UPDATE cel_users SET did_count = ((SELECT did_count FROM cel_users WHERE idaccount = '" + idaccount + "' LIMIT 1) - 1)  WHERE idaccount = '" + idaccount + "' "
				obj.prepare();
				obj.execute((error: any, result: any) => {
					let objss = new ModelRawNonQuery(req, res);
					objss.nonqrysql = "UPDATE `cel_did` SET iduser = '1' WHERE `id`= '" + hhdata + "'";
					objss.prepare();
					objss.execute((error: any, results: any) => {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "DID Removed Successfully" });
						objv.execute();
					})
				})

			})

		})
	}
}