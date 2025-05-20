import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";

export class ModelDelete extends ModelObject
{
	constructor(req:Request, res:Response){
		super(req, res);
		this.type="DELETE";
	}

	public prepare():boolean
	{
		var ret = true;
		if(this.table.length < 1 || this.table=='undefined' || this.table==null)
		{
			console.log("Table is not defined properly.");
			return false;
		}

		if(this.req.query.hasOwnProperty('filter'))
		{
			if(this._isfilter)
			{
				this.nonquery.filter=Object.assign(JSON.parse(this.req.query.filter), this._filter);
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
				ret=false;
			}
		}
		return ret;
	}
	public execute(callback:(error: any, data:any)=>void)
	{
		this.log.Debug("Calling Delete function in ModelObject.");
		this.nonquery.prepare();
		this.nonquery.Execute((err: any, data:any)=>{			
			this.respond(err, data, callback);
		});
	}
}