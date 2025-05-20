import { UserInterface } from "./UserInterface";


export class DetailData extends UserInterface
{
	public prepare(result:any)
	{
		if(result==null || result.length < 1)
			this._status=false;
		else
		{
			this._status=true;
			this._data=result;
		}
	}

	public execute()
	{		
		if(this._status)
			this.response.status(200).send({data: this._data});
		else
			this.response.status(404).send({data: this._data});
	}
}