import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";

export class ModelRawNonQuery extends ModelObject
{
	prepare()
	{
		var ret=true;
		if(this.req.query.hasOwnProperty('filter'))
		{
			if(this._isfilter)
			{
				this.nonquery.filter=Object.assign(JSON.parse(this.req.query.filter), this._filter);
				this.nonquery.isfilter=true;
			}
			else
			{
				this.nonquery.filter=JSON.parse(this.req.query.filter);
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
			}
		}
		this.nonquery.raw_prepare();
		return ret;
	}

	public execute(callback:(error: any, data:any)=>void)
	{		
		this.nonquery.Raw_Execute(function(err: any, data:any){			
			callback(err, data);
		});
		
	}
}