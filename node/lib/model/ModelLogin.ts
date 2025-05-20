import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";
import { modLogin,Login } from "../../config/module.config";
import { Res403 } from "../view/403";
import md5 from "md5";

export class ModelLogin extends ModelObject
{
	public prepare():boolean
	{
		var ret=true;
		let config=new modLogin();
		console.log(this.req.body);
		let paramdata; //={username:"", password:""};
		try{
			paramdata=JSON.parse(this.req.body.data);
		} catch(error)
		{
			console.log(error);
			paramdata=this.req.body.data;
		}

		this.table=config.data.table;
		this.query.field=config.data.selectfield;

		let uname="", passwd="";
	
        if(paramdata.hasOwnProperty(config.data.postfield[0].field))
        {
            uname=paramdata[config.data.postfield[0].field];
        }
        else
        {
			console.log(config.data.postfield[0].field+" is not found");
			let objv= new Res403(this.res);
			objv.prepare({error:"Invalid Username/Password, Kindly check again."});
			objv.execute();
            return false;
        }

		if(paramdata.hasOwnProperty(config.data.postfield[1].field))
        {
			if(config.data.md5)
				passwd=md5(paramdata[config.data.postfield[1].field]);	
			else
				passwd=paramdata[config.data.postfield[1].field];
        }
        else
        {
			console.log(config.data.postfield[1].field+" is not found");
			let objv= new Res403(this.res);
			objv.prepare({error:"Invalid Username/Password, Kindly check again."});
			objv.execute();
            return false;
		}
		let loginfilter:any=null;
		
		if(config.data.filter!=undefined){
			console.log("TOSHU"+config.data.filter);
			let tmp:any="";
			Object.entries(config.data.filter).forEach(
				([key, value]) => {console.log(key, value); tmp +="\""+key+"\":\""+value+"\",";}
			  );
			loginfilter=tmp.replace(/,\s*$/, "");
		}
		this.query.isfilter=true;
		let dbfield=config.data.tablefield;
		let filter='';
		if(loginfilter!==null){
			filter="{\""+dbfield[0]+"\":\""+uname+"\", \""+dbfield[1]+"\":\""+passwd+"\","+loginfilter+"}";
		}else{
			filter="{\""+dbfield[0]+"\":\""+uname+"\", \""+dbfield[1]+"\":\""+passwd+"\"}";
		}
		 
		console.log(filter);
		this.query.filter=JSON.parse(filter);
		this.query.isfilter=true;
		return ret;
	}

	public execute(callback:(error: any, data:any)=>void)
	{		
		this.query.prepare();		
		this.query.Row((err: any, data:any)=>{
			console.log(data);
			if(err>1)
				err=8;
			if(err==1)
				err=2;

			this.respond(err, data, callback);
		});
	}
}
