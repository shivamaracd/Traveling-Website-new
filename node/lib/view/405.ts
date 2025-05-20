import { UserInterface } from "./UserInterface";

export class Res405 extends UserInterface
{	
	public prepare(result:any){this._data=result;}

	public execute()
	{
		this.response.status(405).send({message:"Duplicate Record",error:this._data.error});
	}
}