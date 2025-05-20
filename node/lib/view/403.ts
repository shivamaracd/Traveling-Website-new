import { UserInterface } from "./UserInterface";

export class Res403 extends UserInterface
{	
	public prepare(result:any){this._data=result;}

	public execute()
	{
		this.response.status(403).send({message:"Access Denied!",error:this._data.error});
	}
}