import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";

export class Model_remove extends ModelObject
{
	constructor(req:Request, res:Response){
		super(req,res);
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

		if(this.req.params.hasOwnProperty('filter'))
		{
			if(this._isfilter)
			{
				this.query.filter=Object.assign(JSON.parse(this.req.params.filter), this._filter);
				this.query.isfilter=true;
			}
			else
			{
				this.query.filter=JSON.parse(this.req.params.filter);
				this.query.isfilter=true;
			}
		}
		else
		{
			if(this.req.params.hasOwnProperty('id'))
			{
				if(this._isfilter)
				{
					this.query.filter=Object.assign({id : this.req.params.id}, this._filter);
					this.query.isfilter=true;
				}
				else
				{
					this.query.filter={id : this.req.params.id};
					this.query.isfilter=true;
				}
			}
			else
			{
				if(this._isfilter)
				{
					this.query.filter=this._filter;
					this.query.isfilter=true;
				}
				else
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