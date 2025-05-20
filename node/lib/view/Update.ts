import { UserInterface } from "./UserInterface";

export class UpdateData extends UserInterface
{	
	public prepare(result:any)
	{
		console.log(result);
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
			this.response.status(200).send({message:"Data updated successfully"});
		else
			this.response.status(404).send({message:"Trying to update the wrong data."});
	}
}