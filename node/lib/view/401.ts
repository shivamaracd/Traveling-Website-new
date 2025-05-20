import { UserInterface } from "./UserInterface";

export class Res401 extends UserInterface
{	
	public prepare(result:any){this._data=result;}

	public execute()
	{
		this.response.status(400).send({message:"User logout Request",error:this._data.error});
	}
}