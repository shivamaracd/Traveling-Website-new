import { UserInterface } from "./UserInterface";
import fs from 'fs';

export class DownloadData extends UserInterface
{	
	protected fileToSend:any;
	public prepare(result:any)
	{
		if(result==null || result.length < 1)
			this._status=false;
		else{
			this._status=true;
			var stat = fs.statSync(result.path+result.filename+"."+result.type);
            this.fileToSend = fs.readFileSync(result.path+result.filename+"."+result.type);
            this.response.set('Content-Description' , 'File Transfer');
            this.response.set('Content-Type', 'application/'+result.type);
            this.response.set('Content-Length', stat.size.toString());
            this.response.set('Content-Disposition', result.filename+"."+result.type);
            this.response.set('Expires', '0');
            /* try{
                fs.unlinkSync(result.path+result.filename+"."+result.type);               
            } catch(e){
                console.log(e);
            } */            
		}
	}

	public execute()
	{		
		if(this._status)
			this.response.end(this.fileToSend);
		else
			this.response.status(404).send({error: "Data is not found"});
	}
}