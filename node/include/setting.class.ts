import { Request, Response, NextFunction } from "express";
import { ModelRawQuery } from "../lib/model/RawQuery";
import { SessionManagment } from "../lib/model/Session";
import { Res406 } from "../lib/view/406";
import { RawView } from "../lib/view/RawView";

export class SettingClass {

  constructor() { }

  public editData(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `SELECT id, iduser, cash_type, cash_sub_type FROM cash_status WHERE id='${sdata}'`;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({
              status: error,
              message: "Data Get Successfully!",
              data: result
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

  public updatecashstatus(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata, sdata.id);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `UPDATE cash_type SET cash_type='${sdata.form.cash_type}', cash_sub_type='${sdata.form.cash_sub_type}' WHERE id='${sdata.id}'`;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({
              status: error,
              message: "Case Type Update Successfully!",
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

  public updateStatus(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata, sdata.id);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `UPDATE case_status SET case_status='${sdata.form.case_status}' WHERE id='${sdata.id}'`;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({
              status: error,
              message: "Case Status Update Successfully!",
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

  public updateCourt(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata, sdata.id);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `UPDATE court SET court='${sdata.form.court}' WHERE id='${sdata.id}'`;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({
              status: error,
              message: "Court Update Successfully!",
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

  public updatejudge(req: Request, res: Response, next: NextFunction) {
    let sdata = req.body.data;
    console.log("value", sdata, sdata.id);
    let session = new SessionManagment(req, res, next);
    session.GetSession((error: any, sessdata: any) => {
      if (error == 1) {
        let objs = new ModelRawQuery(req, res);
        objs.qrysql = `UPDATE judge SET judge='${sdata.form.judge}' WHERE id='${sdata.id}'`;
        objs.prepare();
        objs.execute((error: any, result: any) => {
          if (error == 1) {
            let objv = new RawView(res);
            objv.prepare({
              status: error,
              message: "Judge Update Successfully!",
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