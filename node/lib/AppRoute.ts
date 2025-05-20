import { Request, Response, NextFunction } from "express";
import { Database } from "./model/Database";
import { MysqlManager } from "./model/MysqlManager";
import { sessiondata, getMod, cursess } from "../config/module.config";
import { modSession, Module } from "../config/module.config";
import { Res404 } from "./view/404";
import { Res405 } from "./view/405";
import { Management } from "./Management";

export class AppRoute {
    protected sessdata: any;
    protected connection: Database;
    protected filtered: any;

    constructor() {
        console.log("Calling the management class");
        this.connection = new MysqlManager();
        this.connection.Open();
        let config = new modSession();
        this.connection.sql = "SELECT ?? FROM `" + config.data.table + "`";
        config.data.field.push("authkey");
        this.connection.data = [config.data.field];
        this.connection.Execute((err: any, data: any) => {
            if (err == 1) {
                for (let i = 0; i < data.length; i++) {
                    sessiondata.set(data[i].authkey, data[i]);
                }
            }
            this.connection.Close();
        });
    }

    getMethod(req: Request, res: Response, next: NextFunction) {
        let operation: Management;
        let url = req.url.split("?");
        if (url[0] == "/login") {
            operation = new Management(req, res, next);
            operation.UserLogout();
            return;
        }
        else {
            console.log("Current in get Method request with url " + url[0]);
            let modfilter: Module[] = getMod.Search(url[0]);

            if (!getMod.status) {
                let objv = new Res404(res);
                objv.prepare({ error: "No routing is set for current request" });
                objv.execute();
                return;
            }

            let filtered: Module = modfilter[0];
            
            if (modfilter.length > 1) {
                if (req.query.hasOwnProperty("type"))
                    filtered = getMod.Type(req.query.type.toString(), modfilter);
                else {
                    let objv = new Res405(res);
                    objv.prepare({ error: "Multiple route define and type is missing in request" });
                    objv.execute();
                    return;
                }
            }

            console.log("filtered ::", filtered);

            if (filtered.path.length == 0) {
                let objv = new Res404(res);
                objv.prepare({ error: "No config found for request" });
                objv.execute();
                return;
            }


            if (filtered.label != undefined) {
                operation = new Management(req, res, next);
                operation.filtered = filtered;
                operation.sessdata = cursess;
                operation.OptionList();
                return;
            }
            else if (filtered.storedProcedure != undefined) {
                operation = new Management(req, res, next);
                operation.filtered = filtered;
                operation.sessdata = cursess;
                operation.storedProcedure();
                return;
            }
            else {
                if (filtered.sqlqry != undefined) {
                    operation = new Management(req, res, next);
                    operation.filtered = filtered;
                    operation.sessdata = cursess;
                    operation.RawQryList();
                    return;
                }

                if (filtered.table != undefined) {
                    operation = new Management(req, res, next);
                    operation.filtered = filtered;
                    operation.sessdata = cursess;
                    operation.ListView();
                    return;
                }
            }
        }

    }

    postMethod(req: Request, res: Response, next: NextFunction) {
        let operation: Management;
        let url = req.url.split("?");
        if (url[0] == "/login") {
            operation = new Management(req, res, next);
            operation.UserLogin();
            return;
        }

        console.log("Current in post Method request with url " + url[0]);
        let modfilter: Module[] = getMod.Search(url[0]);
        if (!getMod.status) {
            let objv = new Res404(res);
            objv.prepare({ error: "No routing is set for current request" });
            objv.execute();
            return;
        }

        let filtered: Module = modfilter[0];
        if (modfilter.length > 1) {
            if (req.query.hasOwnProperty("type"))
                filtered = getMod.Type(req.query.type.toString(), modfilter);
            else {
                let objv = new Res405(res);
                objv.prepare({ error: "Multiple route define and type is missing in request" });
                objv.execute();
                return;
            }
        }

        if (filtered.path.length == 0) {
            let objv = new Res404(res);
            objv.prepare({ error: "No config found for request" });
            objv.execute();
            return;
        }

        if (filtered.table != undefined) {
            operation = new Management(req, res, next);
            operation.filtered = filtered;
            operation.sessdata = cursess;
            operation.Save();
        }

        if (filtered.storedProcedure != undefined) {
            operation = new Management(req, res, next);
            operation.filtered = filtered;
            operation.sessdata = cursess;
            operation.storedProcedure();
            return;
        }
    }

    putMethod(req: Request, res: Response, next: NextFunction) {
        let operation: Management;
        let url = req.url.split("?");
        console.log("Current in put method request with url " + url[0]);
        let modfilter: Module[] = getMod.Search(url[0]);
        if (!getMod.status) {
            let objv = new Res404(res);
            objv.prepare({ error: "No routing is set for current request" });
            objv.execute();
            return;
        }

        let filtered: Module = modfilter[0];
        if (modfilter.length > 1) {
            if (req.query.hasOwnProperty("type"))
                filtered = getMod.Type(req.query.type.toString(), modfilter);
            else {
                let objv = new Res405(res);
                objv.prepare({ error: "Multiple route define and type is missing in request" });
                objv.execute();
                return;
            }
        }
        console.log(filtered);
        if (filtered.path.length == 0) {
            let objv = new Res404(res);
            objv.prepare({ error: "No config found for request" });
            objv.execute();
            return;
        }

        if (filtered.table != undefined) {
            operation = new Management(req, res, next);
            operation.filtered = filtered;
            operation.sessdata = cursess;
            operation.Update();
        }

        if (filtered.storedProcedure != undefined) {
            operation = new Management(req, res, next);
            operation.filtered = filtered;
            operation.sessdata = cursess;
            operation.storedProcedure();
            return;
        }
    }

    deleteMethod(req: Request, res: Response, next: NextFunction) {
        let operation: Management;
        let url = req.url.split("?");
        console.log("Current in delete method request with url " + url[0]);
        let modfilter: Module[] = getMod.Search(url[0]);
        if (!getMod.status) {
            let objv = new Res404(res);
            objv.prepare({ error: "No routing is set for current request" });
            objv.execute();
            return;
        }

        let filtered: Module = modfilter[0];
        if (modfilter.length > 1) {
            if (req.query.hasOwnProperty("type"))
                filtered = getMod.Type(req.query.type.toString(), modfilter);
            else {
                let objv = new Res405(res);
                objv.prepare({ error: "Multiple route define and type is missing in request" });
                objv.execute();
                return;
            }
        }

        if (filtered.path.length == 0) {
            let objv = new Res404(res);
            objv.prepare({ error: "No config found for request" });
            objv.execute();
            return;
        }

        if (filtered.table != undefined) {
            operation = new Management(req, res, next);
            operation.filtered = filtered;
            operation.sessdata = cursess;
            operation.Delete();
        }


        if (filtered.storedProcedure != undefined) {
            operation = new Management(req, res, next);
            operation.filtered = filtered;
            operation.sessdata = cursess;
            operation.storedProcedure();
            return;
        }
    }

    patchMethod(req: Request, res: Response, next: NextFunction) {
        console.log(req.query);
        let operation: Management;
        let url = req.url.split("?");
        console.log("Current in patch method request with url " + url[0]);
        let modfilter: Module[] = getMod.Search(url[0]);
        if (!getMod.status) {
            let objv = new Res404(res);
            objv.prepare({ error: "No routing is set for current request" });
            objv.execute();
            return;
        }

        let filtered: Module = modfilter[0];
        console.log(filtered);
        if (modfilter.length > 1) {
            if (req.query.hasOwnProperty("type"))
                filtered = getMod.Type(req.query.type.toString(), modfilter);
            else {
                let objv = new Res405(res);
                objv.prepare({ error: "Multiple route define and type is missing in request" });
                objv.execute();
                return;
            }
        }

        if (filtered.path.length == 0) {
            let objv = new Res404(res);
            objv.prepare({ error: "No config found for request" });
            objv.execute();
            return;
        }

        /* if(filtered.label !=undefined)
        {
            operation=new Management(req, res, next);
            operation.filtered=filtered;
            operation.sessdata=cursess;
            return;
        } */

        if (filtered.table != undefined) {
            operation = new Management(req, res, next);
            operation.filtered = filtered;
            operation.sessdata = cursess;
            operation.Update();
            return;
        }
        else {
            if (filtered.sqlqry != undefined) {
                operation = new Management(req, res, next);
                operation.filtered = filtered;
                operation.sessdata = cursess;
                operation.RawQryList();
                return;
            }
        }

        if (filtered.storedProcedure != undefined) {
            operation = new Management(req, res, next);
            operation.filtered = filtered;
            operation.sessdata = cursess;
            operation.storedProcedure();
            return;
        }
    }
}