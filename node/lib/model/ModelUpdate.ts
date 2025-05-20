import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";

export class ModelUpdate extends ModelObject
{
	constructor(req:Request, res:Response)
	{
		super(req,res);
		this.type="UPDATE";		
	}

	public prepare(fields:string[]):boolean
	{
		var ret = true;
		console.log(this.req.query);
		console.log(this.req.body);

		if(this.table.length < 1 || this.table==null)
		{
			console.log("Table is not defined properly.");
			return false;
		}
		let tmpdata:any={}, tmp:any={};

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

		fields.forEach((element) => {
			if(tmpdata.hasOwnProperty(element))
			{
				tmp[element]=tmpdata[element];
			}
		});
		this.nonquery.data=tmp;
		
		if(this.req.query.hasOwnProperty('filter'))
		{
			if(this._isfilter)
			{
				let tmpdata:any;
				try{
					tmpdata=JSON.parse(this.req.query.filter);
				}
				catch{
					tmpdata=this.req.query.filter;
				}
				console.log(tmpdata);
				this.nonquery.filter=Object.assign(tmpdata, this._filter);
				this.nonquery.isfilter=true;
			}
			else
			{
				this.nonquery.filter=JSON.parse(this.req.params.filter);
				this.nonquery.isfilter=true;
			}
		}
		else
		{
			if(this.req.query.hasOwnProperty('id'))
			{
				if(this._isfilter)
				{
					this.nonquery.filter=Object.assign({id : this.req.query.id}, this._filter);
					this.nonquery.isfilter=true;
				}
				else
				{
					this.nonquery.filter={id : this.req.query.id};
					this.nonquery.isfilter=true;
				}
			}
			else
			{
				if(this._isfilter)
				{
					this.nonquery.filter=this._filter;
					this.nonquery.isfilter=true;
				}
				else
				{
					ret=false;
				}
			}
		}
		return ret;
	}

	public execute(callback:(error: any, data:any)=>void)
	{
		
		this.log.Debug("Calling uPDATE function in ModelObject.");
		this.nonquery.prepare();
		this.nonquery.Execute((err: any, data:any)=>{			
			this.respond(err, data, callback);
		});
	}
}