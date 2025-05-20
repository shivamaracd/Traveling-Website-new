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
}
