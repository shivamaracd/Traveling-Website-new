import { ModelObject } from "./ModelObject";

export class ModelListView extends ModelObject
{
	public prepare():boolean
	{
		
		var ret=true;

		//console.log(req);
		
		if(this.query.table.toString().length < 1)
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

		if(this.req.query.hasOwnProperty('filter'))
		{
			if(this._isfilter)
			{
				this.query.filter=Object.assign(JSON.parse(this.req.query.filter), this._filter);
				this.query.isfilter=true;
			}
			else
			{
				this.query.filter=JSON.parse(this.req.query.filter);
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
		return ret;
	}

	public execute(callback:(error: any, data:any)=>void)
	{		
		this.query.prepare();
		this.query.DataSet((err: any, data:any)=>{			
			this.respond(err, data, callback);
		});
		
	}
}
