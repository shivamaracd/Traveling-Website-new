import { UserInterface } from "./UserInterface";

export class ResLogin extends UserInterface
{	
	public prepare(result:any){this._data=result;}

	public execute()
	{
        console.log(this._data);
        if(this._data.hasOwnProperty("id"))
        {
            this.response.status(200).send({message:"Login Successfully."});
        }
        else
		    this.response.status(403).send({message:"Wrong UserName/Password. Try again.",error:this._data.error});
	}
}