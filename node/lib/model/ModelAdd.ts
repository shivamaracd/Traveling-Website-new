import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";

export class ModelAdd extends ModelObject
{
	constructor(req:Request, res:Response)
	{
		super(req, res);
		this.type="INSERT";		
	}

	public prepare(fields:string[]):boolean
	{
		var ret = true;
		console.log(this.req.body);
		//console.log("table::", this.table);

		if(this.table.length < 1 || this.table==null)
		{
			console.log("Table is not defined properly.");
			return false;
		}

		let tmpdata:any, tmp:any={};

		if(this.req.body.hasOwnProperty('data'))
		{
			try{
				tmpdata=JSON.parse(this.req.body.data);
			}
			catch(e)
			{
				tmpdata=this.req.body.data;
			}
		}
		else
		{
			console.log("Data is not found into the request");
			return false;
		}

		if(this._isdata)
		{
			tmpdata=Object.assign(tmpdata,this._data);
		}

		
		fields.forEach((element) => {
			if(tmpdata.hasOwnProperty(element))
			{
				tmp[element]=tmpdata[element];
			}
		});
		console.log(tmp);
		this.nonquery.data=tmp;
		return ret;
		
	}
	public execute(callback:(error: any, data:any)=>void)
	{
		
		this.log.Debug("Calling Add function in ModelObject.");
		this.nonquery.prepare();
		this.nonquery.Execute((err: any, data:any)=>{			
			this.respond(err, data, callback);
		});
	}
}