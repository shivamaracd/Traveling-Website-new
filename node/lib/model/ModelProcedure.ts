import { ModelObject } from "./ModelObject";

export class ModelProcedure extends ModelObject
{
	prepare()
	{
		var ret=true;
		if(this.req.query.hasOwnProperty('procedure'))
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
		this.procedure.raw_prepare();
		return ret;
	}

	public execute(callback:(error: any, data:any)=>void)
	{		
		this.procedure.Raw_Execute(function(err: any, data:any){			
			callback(err, data);
		});
		
	}
}