import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";

export class ModelDetail extends ModelObject
{
	public prepare():boolean
	{
		
		var ret=true;

		if(this.table.length < 1 || this.table=='undefined' || this.table==null)
		{
			console.log("Table is not defined properly.");
			ret=false;
		}

		if(this._data.length > 1)
		{
			this.query.field=this._data;
		}
		else
		{
			console.log("SELECT fields are not defined properly.");
			ret=false;
		}

		if(this.req.params.hasOwnProperty('filter'))
		{
			this.query.filter=Object.assign(JSON.parse(this.req.params.filter), this._filter);
			this.query.isfilter=true;
		}
		else
		{
			if(this.req.params.hasOwnProperty('id'))
			{
				this.query.filter=Object.assign({id : this.req.params.id}, this._filter);
				this.query.isfilter=true;
			}
			else
			{
				console.log("Filter data is not found into the request");
				return false;
			}
		}
		return ret;
	}

	public execute(callback:(error: any, data:any)=>void)
	{		
		this.query.prepare();		
		this.query.Row((err: any, data:any)=>{			
			this.respond(err, data, callback);
		});
	}
}
