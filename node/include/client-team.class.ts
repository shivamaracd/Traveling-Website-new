import { Request, Response, NextFunction } from "express";
import { ModelRawNonQuery } from "../lib/model/RawNonQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";
import { ModelRawQuery } from "../lib/model/RawQuery";

export class Client {
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
        objs.qrysql = `SELECT * FROM client WHERE id='${sdata}'`;
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

  public editDataShipment(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `SELECT * FROM shipment WHERE id='${sdata}'`;
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

  public editDataVendor(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `SELECT * FROM vander WHERE id='${sdata}'`;
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

  public getShipemntdata(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `SELECT * FROM shipment2 WHERE id='${sdata}'`;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({ status: error, message: "Data Get Successfully!", data: result });
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

  public updateVendorData(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `UPDATE vander SET vandor_name='${sdata.data.vandor_name}', vander_description='${sdata.data.vander_description}', vander_address='${sdata.data.vander_address}', vander_address2='${sdata.data.vander_address2}', mobile_no='${sdata.data.mobile_no}', city='${sdata.data.city}', pincode='${sdata.data.pincode}',gst_no='${sdata.data.gst_no}',email='${sdata.data.email}',bank_name='${sdata.data.bank_name}',account_name='${sdata.data.account_name}',ifsc_code='${sdata.data.ifsc_code}',branch='${sdata.data.branch}',country='${sdata.data.country}',state='${sdata.data.state}',contact_person='${sdata.data.contact_person}',bank_city='${sdata.data.bank_city}',bank_state='${sdata.data.bank_state}',bank_country='${sdata.data.bank_country}',bank_pincode='${sdata.data.bank_pincode}',bank_email='${sdata.data.bank_email}',account_number='${sdata.data.account_number}' WHERE id='${sdata.id}'`;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({
              status: error,
              message: "Vendor Update Successfully!",
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

  public updateShipment(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `UPDATE shipment2 SET 
          awb_no = '${sdata.data.awb_no}',
          ref_no = '${sdata.data.ref_no}',
          booking_date = '${sdata.data.booking_date}',
          client = '${sdata.data.client}',
          billing_service = '${sdata.data.billing_service}',
          indent_no = '${sdata.data.indent_no}',
          pickup_point = '${sdata.data.pickup_point}',
          consignor_name = '${sdata.data.consignor_name}',
          company_name = '${sdata.data.company_name}',
          origin_city = '${sdata.data.origin_city}',
          state = '${sdata.data.state}',
          country = '${sdata.data.country}',
          pin_code = '${sdata.data.pin_code}',
          mobile_no = '${sdata.data.mobile_no}',
          alt_mobile_no = '${sdata.data.alt_mobile_no}',
          email_id = '${sdata.data.email_id}',
          gstin = '${sdata.data.gstin}',
          aadhaar_no = '${sdata.data.aadhaar_no}',
          warehousing_receipt_no = '${sdata.data.warehousing_receipt_no}',
          challan_no = '${sdata.data.challan_no}',
          delivery_no = '${sdata.data.delivery_no}',
          po_no = '${sdata.data.po_no}',
          volumetric_weight = '${sdata.data.volumetric_weight}',
          pkgs = '${sdata.data.pkgs}',
          actual_weight = '${sdata.data.actual_weight}',
          weight_unit = '${sdata.data.weight_unit}',
          length = '${sdata.data.length}',
          width = '${sdata.data.width}',
          height = '${sdata.data.height}',
          divisor = '${sdata.data.divisor}',
          remark = '${sdata.data.remark}'
        WHERE id = '${sdata.id}' AND iduser = '${sessdata.id}'
          `;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({ status: error, message: "Shipment Update Successfully!" });
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

  public editClient(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    // console.log("value", sdata, sdata.value);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `UPDATE client SET
  client_name='${sdata.data.client_name}',
  client_description='${sdata.data.client_description}',
  client_address='${sdata.data.client_address}',
  client_address2='${sdata.data.client_address2}',
  mobile_no='${sdata.data.mobile_no}',
  city='${sdata.data.city}',
  pincode='${sdata.data.pincode}',
  gst_no='${sdata.data.gst_no}',
  email='${sdata.data.email}',
  bank_name='${sdata.data.bank_name}',
  account_name='${sdata.data.account_name}',
  ifsc_code='${sdata.data.ifsc_code}',
  account_number='${sdata.data.account_number}',
  bank_city='${sdata.data.bank_city}',
  bank_country='${sdata.data.bank_country}',
  bank_email='${sdata.data.bank_email}',
  bank_pincode='${sdata.data.bank_pincode}',
  bank_state='${sdata.data.bank_state}',
  country='${sdata.data.country}',
  state='${sdata.data.state}',
  alias_name='${sdata.data.alias_name}',
  branch_name='${sdata.data.branch_name}',
  billing_company_name='${sdata.data.billing_company_name}',
  billing_company_address='${sdata.data.billing_company_address}'
WHERE id='${sdata.id}';
`;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({
              status: error,
              message: "Client Update Successfully!",
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

  public saveSearch(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    // console.log("value", sdata, sdata.value);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        if (sdata.trackingNumber) {
          objs.qrysql = "SELECT d.origin, d.booked_on,d.shipper, d.forwarding_no,d.consignee_name, d.status,d.delivery_date, d.delivery_time,d.received_by,d.relation,d.mobile_number,  d.created_at,d.updated_at, m.mode, m.forword_by, m.forwarding_number, c.client_name, c.client_description, c.client_address, c.client_address2, c.mobile_no, c.city, c.pincode, c.gst_no, c.email, c.bank_name, c.account_name, c.ifsc_code, s.id, s.client, s.client_department, s.tracking_number, s.tracking_number, s.order_date, s.destination_pincode, s.destinations, s.configurations_name, s.configurations_address, s.configurations_address1, s.destination_landmark, s.configurations_mobile_number, s.remark, s.remark2, s.volumetric_weight, s.weight, s.height, s.width, s.weight2, s.shipping_cost, d.status,  d.forwarding_no FROM shipment s INNER JOIN delivery d ON d.tracking_number = s.tracking_number INNER JOIN manifest m ON m.tracking_number = s.tracking_number INNER JOIN client c ON c.iduser = s.iduser WHERE s.iduser = '" + sessdata.id + "' AND s.tracking_number ='" + sdata.trackingNumber + "'";
        } else {
          objs.qrysql = "SELECT d.origin, d.booked_on,d.shipper, d.forwarding_no,d.consignee_name, d.status,d.delivery_date, d.delivery_time,d.received_by,d.relation,d.mobile_number,  d.created_at,d.updated_at, m.mode, m.forword_by, m.forwarding_number, c.client_name, c.client_description, c.client_address, c.client_address2, c.mobile_no, c.city, c.pincode, c.gst_no, c.email, c.bank_name, c.account_name, c.ifsc_code, s.id, s.client, s.client_department, s.tracking_number, s.tracking_number, s.order_date, s.destination_pincode, s.destinations, s.configurations_name, s.configurations_address, s.configurations_address1, s.destination_landmark, s.configurations_mobile_number, s.remark, s.remark2, s.volumetric_weight, s.weight, s.height, s.width, s.weight2, s.shipping_cost, d.status,  d.forwarding_no FROM shipment s INNER JOIN delivery d ON d.tracking_number = s.tracking_number INNER JOIN manifest m ON m.tracking_number = s.tracking_number INNER JOIN client c ON c.iduser = s.iduser WHERE s.iduser = '" + sessdata.id + "' AND m.forwarding_number ='" + sdata.forwardingNumber + "'";
        }
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({ status: error, message: "data get Successfully!", data: result });
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
