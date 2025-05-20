import { UserInterface } from "./UserInterface";

export class Res404 extends UserInterface
{	
	public prepare(result:any){this._data=result;}

	public execute()
	{
		this.response.status(404).send({message:"No data found on your request URL",error:this._data.error});
	}
}