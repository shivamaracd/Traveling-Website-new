import { Request, Response, NextFunction } from "express";
import { ModelOtherUpload } from "../lib/model/ModelOthersUpload";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";


export class team_member {

	constructor() { }


	public saveMember(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("sdata", sdata);
		// let extname = generateString(8);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawNonQuery(req, res);
				objs.nonqrysql = `INSERT INTO team_member (idaccount, iduser, username, password, type, firstName, lastName, email, mobileNo, address, country, state, city, role, profile_image, bank_name, account_number, account_name, ifsc_code, bank_city, bank_state, bank_country, bank_pincode, bank_email) VALUES ('${sessdata.idaccount}', '2', '${sdata.userName}', '${sdata.password}', '${sdata.role}', '${sdata.firstName}', '${sdata.lastName}', '${sdata.email}', '${sdata.mobileNo}', '${sdata.address}', '${sdata.country}', '${sdata.state}', '${sdata.city}', '${sdata.role}', '${sdata.profile_image}'`;
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						let objs1 = new ModelRawNonQuery(req, res);
						objs1.nonqrysql = `INSERT INTO users (idaccount, username, password, type, role, firstName, lastName, email, profile_image, phone_number, bank_name, account_number, account_name, ifsc_code, bank_city, bank_state, bank_country, bank_pincode, bank_email) VALUES ('${sessdata.idaccount}', '${sdata.userName}', '${sdata.password}',2, '${sdata.role}', '${sdata.firstName}', '${sdata.lastName}', '${sdata.email}', '${sdata.profile_image}', '${sdata.mobileNo}', '${sdata.bank_name}', '${sdata.account_number}', '${sdata.account_name}', '${sdata.ifsc_code}', '${sdata.bank_city}', '${sdata.bank_state}', '${sdata.bank_country}', '${sdata.bank_pincode}', '${sdata.bank_email}')`;
						objs1.prepare();
						objs1.execute((error: any, result: any) => { })

						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "Member Created Successfully" });
						objv.execute();
						// if (sdata.sendemail) {
						// 	sendMail(sdata);
						// }
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

	public executiveMapping(req: Request, res: Response, next: NextFunction) {
		let mdata = req.body.data;
		let exelist = mdata.mappedexe;
		console.log("mdata", mdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let obj = new ModelRawNonQuery(req, res);
				obj.nonqrysql = "UPDATE `users` SET role = '" + JSON.stringify(mdata.newList) + "' WHERE id = '" + mdata.idgroup + "'";
				obj.prepare();
				obj.execute((error, result1) => {
					// let obj1 = new ModelRawQuery(req, res);
					// obj1.qrysql = "SELECT groupname FROM `cel_groups` WHERE id=" + mdata.idgroup;
					// obj1.prepare();
					// obj1.execute((error: any, reggroup: any) => {
					// 	let obj2 = new ModelRawNonQuery(req, res);
					// 	obj2.nonqrysql = "DELETE FROM `tiers` WHERE `queue`='" + reggroup[0].groupname + "' AND iduser = '" + sessdata.id + "'";
					// 	obj2.prepare();
					// 	obj2.execute((error, result1) => {
					// 		for (let i = 0; i < exelist.length; i++) {
					// 			let obj3 = new ModelRawQuery(req, res);
					// 			obj3.qrysql = "SELECT `name` FROM `agents` WHERE `id`=" + exelist[i];
					// 			obj3.prepare();
					// 			obj3.execute((error: any, agres: any) => {
					// 				let obj4 = new ModelRawNonQuery(req, res);
					// 				obj4.nonqrysql = `INSERT INTO tiers(iduser, agent, queue, state, idagent, id_agentgroup) VALUES ('${sessdata.id}', '${agres[0].name}', '${reggroup[0].groupname}', 'Ready', '${exelist[i]}', '${mdata.idgroup}')`;
					// 				obj4.prepare()
					// 				obj4.execute((error: number, udata: any) => { });
					// 			});
					// 		}
					if (result1) {
						let obj4 = new RawView(res);
						obj4.prepare({ message: "Executive Updated Successfully" });
						obj4.execute();
					} else {
						let objv = new RawView(error);
						objv.prepare({ status: 500, message: "Something went wrong" });
						objv.execute();
					}
					// 		});
					// 	});
				});
			} else {
				let objv = new Res406(res);
				objv.prepare(session);
				objv.execute();
			}

		});
	}


	public getMemberById(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				objs.qrysql = `SELECT * FROM users WHERE id='${sdata}'`;
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({
							status: error,
							message: "Data Get Successfully!",
							data: result,
						});
						objv.execute();
					} else {
						let objv = new RawView(res);
						objv.prepare({ status: error, message: result.sqlMessage });
						objv.execute();
					}
				});
			} else {
				let objv = new Res406(res);
				objv.prepare("No seesion found!");
				objv.execute();
			}
		});
	}



	public updateMember(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata, sdata.id);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				// First update team_member table
				objs.qrysql = `UPDATE team_member SET firstName='${sdata.data.firstName}', lastName='${sdata.data.lastName}', email='${sdata.data.email}', mobileNo='${sdata.data.mobileNo}', userName='${sdata.data.userName}', password='${sdata.data.password}', country='${sdata.data.country}', state='${sdata.data.state}', city='${sdata.data.city}', address='${sdata.data.address}', role='${JSON.stringify(sdata.data.role)}' WHERE id='${sdata.id}'`;
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						// After successful update of team_member, update users table
						let objsUser = new ModelRawQuery(req, res);
						objsUser.qrysql = `UPDATE users SET firstname='${sdata.data.firstName}', lastname='${sdata.data.lastName}', email='${sdata.data.email}', phone_number='${sdata.data.mobileNo}', username='${sdata.data.userName}', password='${sdata.data.password}', country='${sdata.data.country}', state='${sdata.data.state}', city='${sdata.data.city}', address='${sdata.data.address}', role='${JSON.stringify(sdata.data.role)}', bank_name='${sdata.data.bank_name}', account_number='${sdata.data.account_number}', account_name='${sdata.data.account_name}', ifsc_code='${sdata.data.ifsc_code}', bank_city='${sdata.data.bank_city}', bank_state='${sdata.data.bank_state}', bank_country='${sdata.data.bank_country}', bank_pincode='${sdata.data.bank_pincode}', bank_email='${sdata.data.bank_email}' WHERE id='${sdata.id}'`;
						objsUser.prepare();
						objsUser.execute((userError: any, userResult: any) => {
							if (error == 1) {
								let objv = new RawView(res);
								objv.prepare({ status: error, message: "Member Details Updated Successfully!", });
								objv.execute();
							} else {
								let objv = new RawView(res);
								objv.prepare({ status: error, message: "Something went wrong!" });
								objv.execute();
							}
						});
					} else {
						let objv = new Res406(res);
						objv.prepare("No seesion found!");
						objv.execute();
					}
				});
			}
		})

	}
}
