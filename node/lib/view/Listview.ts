import { UserInterface } from "./UserInterface";

export class ListData extends UserInterface
{	
	public prepare(result:any)
	{
		if(result==null || result.length < 1)
			this._status=false;
		else{
			this._status=true;
			this._data=result;
		}
	}

	public execute()
	{
		//console.log(this._data);
		if(this._status)
			this.response.status(200).send(this._data);
		else
			this.response.status(404).send({error: "Data is not found"});
	}
}