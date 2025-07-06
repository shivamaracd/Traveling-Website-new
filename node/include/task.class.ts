import { Request, Response, NextFunction } from "express";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";
import { ModelRawQuery } from "../lib/model/RawQuery";

export class Task {
  constructor() { }

  public saveClient(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata);
    // let session = new SessionManagment(req, res, next);
    // session.GetSession((error: any, sessdata: any) => {
    //   if (error == 1) {
    //     let objs = new ModelRawNonQuery(req, res);
    //     objs.nonqrysql = `INSERT INTO client ("id", "iduser", "first_name", "middle_name", "last_name", "email", "mobile_no", "gender", "alternative_no", "address", "country","state","city","reference_name", "reference_number") VALUES ('${sessdata.idaccount}', '${sessdata.iduser}', '${sdata.username}', '${sdata.password}', '${sdata.type}', '${sdata.first_name}', '${sdata.last_name}', '${sdata.email}', '${sdata.phoneno}', '${sdata.address}', '${sdata.country}', '${sdata.state}', '${sdata.city}', '${sdata.role}', '${sdata.profile_image}')`;
    //     objs.prepare();
    //     objs.execute((error: any, result: any) => {
    //       if (error == 1) {
    // 		let objv = new RawView(res);
    //         objv.prepare({ status: error, message: "Client Create Successfully!" });
    //         objv.execute();
    //       } else {
    //         let objv = new RawView(res);
    //         objv.prepare({ status: error, message: result.sqlMessage });
    //         objv.execute();
    //       }
    //     });
    //   } else {
    //     let objv = new Res406(res);
    //     objv.prepare("No seesion found!");
    //     objv.execute();
    //   }
    // });
  }

  public editData(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `SELECT DATE_FORMAT(deadline, '%d:%m:%Y') AS deadline, decripations, id, iduser, priority, relatedTo, DATE_FORMAT(startDate, '%d:%m:%Y') AS startDate, status, subject FROM task WHERE id='${sdata}'`;
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

  public editTask(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    // console.log("value", sdata, sdata.value);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `UPDATE task SET subject='${sdata.data.subject}', decripations='${sdata.data.decripations}', priority='${sdata.data.priority}', status='${sdata.data.status}', startDate='${sdata.data.startDate}', deadline='${sdata.data.deadline}', relatedTo='${sdata.data.relatedTo}' WHERE id='${sdata.id}'`;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({
              status: error,
              message: "Task Update Successfully!",
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

  getDataPicupReport(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = "SELECT s.created_at, s.`client`, s.awb_no`tracking_number`, m.`destination`, m.`status`, s.created_at`order_date`, s.pin_code`destination_pincode`, s.consignor_name,CONCAT(s.`state`, ', ', s.`country`, ', ', s.`pin_code`)`consignee_address`, s.mobile_no`consignee_mobile_number`, s.actual_weight`weight` FROM `shipment2` s inner join `manifests` m on  m.`tracking_number`=s.`awb_no` where s.`client`='"+ sdata  +"'";
        // objs.qrysql = "SELECT s.po_no,s.ref_no,s.volumetric_weight,d.origin, d.destination,s.awb_no as tracking_number, s.booking_date,s.client, s.billing_service, s.consignor_name, s.indent_no, s.pickup_point, s.consignor_name, s.company_name, s.origin_city, s.state, s.country, s.pin_code, s.mobile_no, s.email_id, s.pkgs as packages, s.actual_weight, s.remark as shipment_remarks, m.manifest_number, m.date as manifest_date, m.forwarding_number, m.forwarding_by, m.destination as manifest_destination, m.branch, m.status as manifest_status, m.remarks as manifest_remarks, m.driver_contact, m.vehicle_number, m.driver_name, d.delivery_date, d.delivery_time, d.consignee_name, d.received_by, d.relation, d.mobile_number as receiver_mobile, d.remark as delivery_remarks, v.vandor_name, v.vander_description, v.vander_address, v.mobile_no as vendor_email, v.email as vendor_email, v.contact_person FROM shipment2 s INNER JOIN manifests m ON s.awb_no = m.tracking_number AND s.iduser = m.iduser INNER JOIN delivery d ON s.awb_no = d.tracking_number AND s.iduser = d.iduser INNER JOIN vander v ON s.iduser = v.iduser WHERE s.iduser = '"+sessdata.id +"' and s.awb_no = '"+sdata+"' limit 1;";
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({status: error,message: "Data Get Successfully!", data: result});
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


  getDataMISReport(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = "SELECT s.awb_no`tracking_number`, s.`client`, d.`forwarding_by`, d.`forwarding_no`, d.booked_on`booking_date`, s.pin_code`destination_pincode`, d.`destination`, d.consignee_name,CONCAT(s.`state`, ', ', s.`country`, ', ', s.`pin_code`)`consignee_address`,d.mobile_number`consignee_mobile_number`,s.actual_weight`weight`, d.`status`, d.delivery_date FROM `shipment2` s INNER JOIN `delivery` d ON  d.`tracking_number`=s.`awb_no` WHERE s.`client`='"+ sdata +"'";
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({status: error,message: "Data Get Successfully!", data: result});
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
