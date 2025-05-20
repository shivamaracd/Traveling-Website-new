import { Request, Response, NextFunction } from "express";
import { ModelOtherUpload } from "../lib/model/ModelOthersUpload";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";


export class Account {

	constructor() { }

	public account(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			let obj = new ModelRawQuery(req, res);
			obj.qrysql = `INSERT INTO cel_account(iduser,first_name, last_name, expiry, country, phone, call_broadcast, gender, website, campaign_type, company_name, password, confirm_password, address, city, postal_code) VALUES ('${sessdata.id}','${sdata.firstname}','${sdata.lastname}','${sdata.expiry}','${sdata.country}','${sdata.phone}','${sdata.callbroadcast}','${sdata.gender}','${sdata.website}','${sdata.campaigntype}','${sdata.companyname}','${sdata.password}','${sdata.confirmpassword}','${sdata.address}','${sdata.city}','${sdata.postalcode}')`;
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

		});
	}

}