import { UserInterface } from "./UserInterface";

export class Res406 extends UserInterface
{	
	public prepare(result:any){this._data=result;}

	public execute()
	{
		this.response.status(406).send({message:"Session is not allowed",error:this._data.error});
	}
}