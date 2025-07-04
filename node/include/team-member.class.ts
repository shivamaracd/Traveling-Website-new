import { Request, Response, NextFunction } from "express";
import { ModelOtherUpload } from "../lib/model/ModelOthersUpload";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";
import { start } from "repl";
import { ModelCsvUpload } from "../lib/model/ModelCsvUpload";

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

	public getFilterStatusdata(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				objs.qrysql = "SELECT s.created_at, s.awb_no`tracking_number`, s.`client`, d.`forwarding_by`, d.`forwarding_no`, d.booked_on`booking_date`, s.pin_code`destination_pincode`, d.`destination`, d.consignee_name,CONCAT(s.`state`, ', ', s.`country`, ', ', s.`pin_code`)`consignee_address`,d.mobile_number`consignee_mobile_number`, s.actual_weight`weight`, d.`status`, d.delivery_date FROM `shipment2` s INNER JOIN `delivery` d ON  d.`tracking_number`=s.`awb_no` WHERE s.created_at BETWEEN '" + sdata.start + "' AND '" + sdata.end + "'";
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						if (error == 1) {
							let objv = new RawView(res);
							objv.prepare({ status: error, message: "filter data get Successfully!", data: result });
							objv.execute();
						} else {
							let objv = new RawView(res);
							objv.prepare({ status: error, message: "Something went wrong!" });
							objv.execute();
						}
					} else {
						let objv = new Res406(res);
						objv.prepare("No seesion found!");
						objv.execute();
					}
				});
			}
		})

	}

	public getFilterPicupdata(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				objs.qrysql = "SELECT s.awb_no`tracking_number`, s.`client`, d.`forwarding_by`, d.`forwarding_no`, d.booked_on`booking_date`, s.pin_code`destination_pincode`, d.`destination`, d.consignee_name,CONCAT(s.`state`, ', ', s.`country`, ', ', s.`pin_code`)`consignee_address`,d.mobile_number`consignee_mobile_number`,s.actual_weight`weight`, d.`status`, d.delivery_date FROM `shipment2` s INNER JOIN `delivery` d ON  d.`tracking_number`=s.`awb_no` WHERE s.created_at BETWEEN '" + sdata.start + "' AND '" + sdata.end + "'";
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						if (error == 1) {
							let objv = new RawView(res);
							objv.prepare({ status: error, message: "filter data get Successfully!", data: result });
							objv.execute();
						} else {
							let objv = new RawView(res);
							objv.prepare({ status: error, message: "Something went wrong!" });
							objv.execute();
						}
					} else {
						let objv = new Res406(res);
						objv.prepare("No seesion found!");
						objv.execute();
					}
				});
			}
		})

	}

	public getFilterMISdata(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				objs.qrysql = "SELECT s.awb_no`tracking_number`, s.`client`, d.`forwarding_by`, d.`forwarding_no`, d.booked_on`booking_date`, s.pin_code`destination_pincode`, d.`destination`, d.consignee_name,CONCAT(s.`state`, ', ', s.`country`, ', ', s.`pin_code`)`consignee_address`,d.mobile_number`consignee_mobile_number`,s.actual_weight`weight`, d.`status`, d.delivery_date FROM `shipment2` s INNER JOIN `delivery` d ON  d.`tracking_number`=s.`awb_no` WHERE s.created_at BETWEEN '" + sdata.start + "' AND '" + sdata.end + "'";
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						if (error == 1) {
							let objv = new RawView(res);
							objv.prepare({ status: error, message: "filter data get Successfully!", data: result });
							objv.execute();
						} else {
							let objv = new RawView(res);
							objv.prepare({ status: error, message: "Something went wrong!" });
							objv.execute();
						}
					} else {
						let objv = new Res406(res);
						objv.prepare("No seesion found!");
						objv.execute();
					}
				});
			}
		})

	}


	public uploadDeliveryFile(req: Request, res: Response, next: NextFunction) {
		console.log(req.file)
		let type = req.body.type;
		let extence = req.body.extance;
		console.log("dasd", extence, type);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let nvalue: any = req.file
				let objfile = new ModelCsvUpload(req, res);
				let fdata: any = objfile.fileUpload();
				let size = (fdata[3] / 1024 / 1024).toFixed(3);
				// let obja = new ModelRawNonQuery(req, res);
				// obja.nonqrysql = `INSERT INTO cel_uploads_contact(iduser, filename, file_type, filepath, size) VALUES ("${sessdata.id}","${fdata[0]}", "${req.body.type}", "${fdata[1]}", ${size})`;
				// obja.prepare();
				// obja.execute((error: any, result: any) => {
				// 	let lastid = result.insertId;
				let obj = new ModelRawNonQuery(req, res)
				obj.nonqrysql = "LOAD DATA LOCAL INFILE  '" + fdata[1] + fdata[0] + "' INTO TABLE shipment2  FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (@cal1,@cal2,@cal3,@cal4,@cal5,@cal6,@cal7,@cal8,@cal9,@cal10,@cal11,@cal12,@cal13,@cal14,@cal15,@cal16,@cal17,@cal18,@cal19,@cal20,@cal21,@cal22,@cal23,@cal24,@cal25,@cal26,@cal27) SET awb_no=@cal1, booking_date=@cal2, ref_no=@cal3, po_no=@cal4, client=@cal5, services=@cal6, indent_no=@cal7, pickup_point=@cal8, consignor_name=@cal9, consignor_address1=@cal10, consignor_address2=@cal11, landmark=@cal12, destinations=@cal13, state=@cal14, country=@cal15, pin_code=@cal16, mobile_no=@cal17, alt_mobile_no=@cal18, weight_unit=@cal19, email_id=@cal20, gstin=@cal21, aadhaar_no=@cal22, warehousing_receipt_no=@cal23, challan_no=@cal24, delivery_no=@cal25, actual_weight=@cal26, volumetric_weight=@cal27, iduser = '" + sessdata.id + "'";
				obj.prepare();
				obj.execute((error: number, result: any) => {
					// let objd = new ModelRawQuery(req, res);
					// objd.qrysql = "SELECT COUNT(upload_id)`total` FROM cel_leads WHERE upload_id = '" + lastid + "'";
					// objd.prepare();
					// objd.execute((error: any, resultss: any) => {
					// 	console.log("count:::", resultss)
					// 	let totalcount = resultss[0].total
					// 	let obj = new ModelRawNonQuery(req, res);
					// 	obj.nonqrysql = "UPDATE `cel_uploads_contact` SET `total_count`= '" + totalcount + "' WHERE id = '" + lastid + "'";
					// 	obj.prepare();
					// 	obj.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: `Booking File Uploaded Successfully!`, data: { filename: fdata[0] } });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 501, message: `Booking Files Uploads Failed !`, data: {} });
						objv.execute();
					}
				});
				// 	});
				// });

				// })
			}
			else {
				let objv = new Res406(res);
				objv.prepare({ status: 401, message: "Invalid Authentication!" });
				objv.execute();
			}
		});
	}

	public importDeliveryFile(req: Request, res: Response, next: NextFunction) {
		console.log(req.file)
		let type = req.body.type;
		let extence = req.body.extance;
		console.log("dasd", extence, type);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: number, sessdata: any) => {
			if (error == 1) {
				let nvalue: any = req.file
				let objfile = new ModelCsvUpload(req, res);
				let fdata: any = objfile.fileUpload();
				let size = (fdata[3] / 1024 / 1024).toFixed(3);
				let obj = new ModelRawNonQuery(req, res)
				obj.nonqrysql = "LOAD DATA LOCAL INFILE  '" + fdata[1] + fdata[0] + "' INTO TABLE delivery  FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (@cal1,@cal2,@cal3,@cal4,@cal5,@cal6,@cal7,@cal8) SET tracking_number=@cal1, status=@cal2, delivery_date=@cal3, delivery_time=@cal4, received_by=@cal5, relation=@cal6, mobile_number=@cal7, remark=@cal8, iduser = '" + sessdata.id + "'";
				obj.prepare();
				obj.execute((error: number, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: `Delivery File Uploaded Successfully!`, data: { filename: fdata[0] } });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 501, message: `Delivery Files Uploads Failed !`, data: {} });
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

	public saveDRSData(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				objs.qrysql = "INSERT INTO drs_manifest (iduser,manifest_number, origin, drs_sheet_date, drs_sheet_no, delivery_boys_name, delivery_boys_contact, shipment_status, tracking_number) VALUES ('" + sessdata.id + "', '" + sdata.manifest_number + "', '" + sdata.origin + "', '" + sdata.drs_sheet_date + "', '" + sdata.drs_sheet_no + "', '" + sdata.delivery_boys_name + "', '" + sdata.delivery_boys_contact + "', '" + sdata.shipment_status + "', '" + sdata.tracking_number + "')";	
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "DRS Data Saved Successfully!" });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong!" });
						objv.execute();
					}
				});
			}
		});
	}

	public getDrsManifest(req: Request, res: Response, next: NextFunction) {
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				objs.qrysql = "SELECT id, manifest_number, drs_sheet_date, origin, drs_sheet_no, delivery_boys_name, delivery_boys_contact, shipment_status, tracking_number FROM drs_manifest WHERE iduser = '" + sessdata.id + "'";
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "DRS Manifest Data Fetched Successfully!", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong!" });
						objv.execute();
					}
				});
			}
		});
	}

	public getEditValuedrs(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				objs.qrysql = "SELECT * FROM drs_manifest WHERE id = '" + sdata + "'";	
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "DRS Manifest Data Fetched Successfully!", data: result });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong!" });
						objv.execute();
					}
				});
			}
		});
	}

	public updateDRSData(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				objs.qrysql = "UPDATE drs_manifest SET manifest_number = '" + sdata.manifest_number + "', origin = '" + sdata.origin + "', drs_sheet_date = '" + sdata.drs_sheet_date + "', drs_sheet_no = '" + sdata.drs_sheet_no + "', delivery_boys_name = '" + sdata.delivery_boys_name + "', delivery_boys_contact = '" + sdata.delivery_boys_contact + "', shipment_status = '" + sdata.shipment_status + "', tracking_number = '" + sdata.tracking_number + "' WHERE id = '" + sdata.id + "'";		
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "DRS Manifest Data Updated Successfully!" });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong!" });
						objv.execute();
					}
				});
			}
		});
	}

	public deleteDRSData(req: Request, res: Response, next: NextFunction) {
		let sdata = req.body.data;
		console.log("value", sdata);
		let session = new SessionManagment(req, res, next);
		session.GetSession((error: any, sessdata: any) => {
			if (error == 1) {
				let objs = new ModelRawQuery(req, res);
				objs.qrysql = "DELETE FROM drs_manifest WHERE id = '" + sdata + "'";	
				objs.prepare();
				objs.execute((error: any, result: any) => {
					if (error == 1) {
						let objv = new RawView(res);
						objv.prepare({ status: 200, message: "DRS Manifest Data Deleted Successfully!" });
						objv.execute();
					}
					else {
						let objv = new RawView(res);
						objv.prepare({ status: 500, message: "Something went wrong!" });
						objv.execute();
					}
				});
			}
		});
	}
}
