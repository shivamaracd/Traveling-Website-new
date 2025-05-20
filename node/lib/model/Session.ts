import { MysqlManager } from "./MysqlManager";
import { Database } from "./Database";
import { Request, Response, NextFunction } from "express";
import { modSession,Session, sessiondata} from "../../config/module.config";
import { Res403 } from "../view/403";
import { Res406 } from "../view/406";
import md5 from "md5";
import { exists } from "fs";

export class CurrentSession
{
    private __session:any;
    private __error:any;
    private __message:any;
    private __requestURI:string="";
    private __config:any;
    private __type:any;

    public get requestURI()
    {
        return this.__requestURI;
    }

    public set requestURI(val)
    {
        this.__requestURI=val;
    }

    public get config()
    {
        return this.__config;
    }

    public set config(val)
    {
        this.__config=val;
    }

    public get type()
    {
        return this.__type;
    }

    public set type(val)
    {
        this.__type=val;
    }

    public get session()
    {
        return this.__session;
    }

    public set session(val)
    {
        this.__session=val;
    }

    public get error()
    {
        return this.__error;
    }

    public set error(val)
    {
        this.__error=val;
    }

    public get message()
    {
        return this.__message;
    }

    public set message(val)
    {
        this.__message=val;
    }
}

export class SessionManagment
{
    protected connection:Database;
    protected req:Request;
    protected res:Response;
    protected next:NextFunction;
    protected config = new modSession();

    constructor(req:Request, res:Response, next:NextFunction)
    {
        this.req=req;
        this.res=res;
        this.next=next;
        this.connection=new MysqlManager();
    }
    
   public SetSession(data:any, callback:(error:any, data:any)=>void)
    {
        this.connection.Open();
        sessiondata.clear();
        let key=md5(JSON.stringify(data)+(new Date().getUTCMilliseconds()));
        let tmp:string="{\""+this.config.data.session+"\": \""+key+"\"}";
        let field=JSON.parse(tmp);
        let sessdata=Object.assign(data, field);
        this.connection.data=sessdata;
        // this.connection.sql="INSERT INTO `"+this.config.data.table+"` SET ?";
        this.connection.sql = "INSERT INTO `" + this.config.data.table + "` SET ?  ON DUPLICATE KEY UPDATE `authkey`='" + key + "'";
        sessiondata.set(key, sessdata);
        this.connection.Execute((err: any, data:any)=>{		
            if(err==1)
			{
				callback(err, data);
			}
			else
			{
				let objv = new Res403(this.res);
				objv.prepare({error: "User session cannot created"});
				objv.execute();
            }
            this.connection.Close();
        });
    }

    public GetSession(callback:(error:any, data:any)=>void)
    {
        let akey:any=this.req.headers.authorization;
        console.log("Current authorization key "+akey);
        if(akey==undefined || akey=="")
        {
            let objv = new Res406(this.res);
            objv.prepare({error: "Invalid session is called to access"});
            objv.execute();
            return;
        }
        if(sessiondata.has(akey))
        {
            console.log(sessiondata.get(akey));
            callback(1, sessiondata.get(akey));
            return;            
        }

        console.log("============================Session not exists===================================");
        this.connection.Open();
        this.connection.sql="SELECT ?? FROM `"+this.config.data.table+"` WHERE ?";        
        this.connection.data=[this.config.data.field, {authkey:akey}];
        this.connection.Row((err: any, data:any)=>{			
            console.log("============================Session not exists with data===================================");
			if(err==1)
			{
                sessiondata.set(akey, data);
				callback(err, data);
			}
			else
			{
                let objv = new Res406(this.res);
                objv.prepare({error: "Invalid session is called to access"});
                objv.execute();
				//callback(406,"Invalid session is called to access");
            }
            this.connection.Close();
            console.log("============================Session not exists with data===================================");
        });
        console.log("============================Session not exists===================================");
    }

    public DeleteSession(callback:(error:any, data:any)=>void)
    {
        this.connection.Open();
        this.connection.sql=" DELETE FROM `"+this.config.data.table+"` WHERE `"+this.config.data.session+"`='"+this.req.headers.authorization+"'";
        sessiondata.remove(this.req.headers.authorization);
        this.connection.Delete((err: any, data:any)=>{
           /*  let objv = new Res406(this.res);
            objv.prepare({error: "Invalid session authorization"});
            objv.execute(); */
            callback(err, data);
            this.connection.Close();
		});
    }

    public getdata(data:any, val:string)
    {
        Object.entries(data).forEach(
            ([key, value]) => {console.log(key, value); if(key==val) return value;}
        );
    }
}