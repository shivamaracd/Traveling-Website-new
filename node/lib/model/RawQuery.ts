import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";

export class ModelRawQuery extends ModelObject
{
	constructor(req:Request, res:Response){
		super(req,res);
	}

	prepare()
	{
		
		var ret=true;
		if(!this.query.isSQL)
			ret=false;
		
		//console.log(this.req.query);
		
		if(this.req.query.hasOwnProperty('where'))
		{
			if(this._isfilter)
			{
				//this.query.filter=Object.assign(this._filter);
				let tmp3="";
				Object.entries(this._filter).forEach(
					([key, value]) => {console.log(key, value); tmp3 +=""+key+"='"+value+"' AND ";}
				);
				this.query.isfilter=false;
				if(this.query.where)
					this.query.sql=this.query.sql+" "+tmp3+" "+this.req.query.where;
				else
					this.query.sql=this.query.sql+" WHERE "+tmp3+" "+this.req.query.where;
			}
			else
			{
				if(this.query.where)
					this.query.sql=this.query.sql+" "+this.req.query.where;
				else
					this.query.sql=this.query.sql+" WHERE "+this.req.query.where;
				
				this.query.isfilter=false;
			}
		}
		else if(this.req.query.hasOwnProperty('filter'))
		{
			if(this._isfilter)
			{
				this.query.filter=Object.assign(JSON.parse(this.req.query.filter), this._filter);
				this.query.isfilter=true;
			}
			else
			{
				this.query.filter=JSON.parse(this.req.query.filter);
				//console.log(this.query.filter);
				this.query.isfilter=true;
			}
		}
		else
		{
			if(this.req.query.hasOwnProperty('id'))
			{
				if(this._isfilter)
				{
					this.query.filter=Object.assign({id : this.req.query.id}, this._filter);
					this.query.isfilter=true;
				}
				else
				{
					this.query.filter={id : this.req.query.id};
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
			}
		}
		console.log("Master query for RawQuery : "+this.query.sql);
		console.log("Master filter for RawQuery : "+this.query.filter);
		console.log("Master group for RawQuery : "+this.query.group);
		console.log("Master order for RawQuery : "+this.query.order);
		this.query.rawprepare();
		
		return ret;
	}

	public execute(callback:(error: any, data:any)=>void)
	{		
		this.query.Raw_Execute(function(err: any, data:any){			
			callback(err, data);
		});
		
	}
}