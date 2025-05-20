import { Request, Response, NextFunction } from "express";
import { ModelOtherUpload } from "../lib/model/ModelOthersUpload";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";


export class cases {

	constructor() { }

    
	public saveCase(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		// let extname = generateString(8);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawNonQuery(req, res);
				// objs.nonqrysql = `INSERT INTO team_member (idaccount, iduser, username, password, type, firstName, lastName, email, mobileNo, address, country, state, city, role, profile_image) VALUES ('${sessdata.idaccount}', '2', '${sdata.userName}', '${sdata.password}', '${sdata.role}', '${sdata.firstName}', '${sdata.lastName}', '${sdata.email}', '${sdata.mobileNo}', '${sdata.address}', '${sdata.country}', '${sdata.state}', '${sdata.city}', '${sdata.role}', '${sdata.profile_image}')`;
                objs.nonqrysql = `INSERT INTO case (iduser, client_name, respondent_name, is_petitioner, respondent_advocate, case_no, case_type, case_sub_type, stage_of_case, act, filing_number, filing_date, registration_number, registration_date, first_hearing_date, cnr_number, description, priority, police_station, fir_number, fir_date, court_no, court_type, court_name, judge_type, judge_name, remarks, assigned_users) VALUES ( '2','${sdata.clientName}', '${sdata.respondentName}', '${sdata.isPetitioner}', '${sdata.respondentAdvocate}', '${sdata.caseNo}', '${sdata.caseType}', '${sdata.caseSubType}', '${sdata.stageOfCase}', '${sdata.act}', '${sdata.filingNumber}', '${sdata.filingDate}', '${sdata.registrationNumber}', '${sdata.registrationDate}', '${sdata.firstHearingDate}', '${sdata.cnrNumber}', '${sdata.description}', '${sdata.priority}', '${sdata.policeStation}', '${sdata.firNumber}', '${sdata.firDate}', '${sdata.courtNo}', '${sdata.courtType}', '${sdata.courtName}', '${sdata.judgeType}', '${sdata.judgeName}', '${sdata.remarks}', '${sdata.assignedUsers}')`;
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "case Created Successfully" });
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


	public getMemberById(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
		  if (error == 1) {
			let objs = new ModelRawQuery(req, res);
			objs.qrysql = `SELECT * FROM team_member WHERE id='${sdata}'`;
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
		// console.log("value", sdata, sdata.id);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
		  if (error == 1) {
			let objs = new ModelRawQuery(req, res);
			objs.qrysql = `UPDATE team_member SET firstName='${sdata.data.firstName}', lastName='${sdata.data.lastName}', email='${sdata.data.email}', mobileNo='${sdata.data.mobileNo}', userName='${sdata.data.userName}', password='${sdata.data.password}', country='${sdata.data.country}', state='${sdata.data.state}', city='${sdata.data.city}', address='${sdata.data.address}', role='${sdata.data.role}' WHERE id='${sdata.id}'`;
			objs.prepare();
			objs.execute((error: any, result: any) => {
			  if (error == 1) {
				let objv = new RawView(res);
				objv.prepare({
				  status: error,
				  message: "Member Details Updated Successfully!",
				});
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

}