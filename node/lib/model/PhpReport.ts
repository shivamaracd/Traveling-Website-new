import { Exec } from "./ExecExecute";
let objexec = new Exec();

export class PhpReport
{
	constructor(){}
	
	public phpreport(destination:string, parameter:string, callback:(data:any)=>void){
		objexec.execute("/usr/bin/php "+destination+" "+parameter+"", function(data:any){
			callback(data);
		});		
	}
}