import { Exec } from "./ExecExecute";
let objexec = new Exec();

export class ReloadXml
{
	constructor(){}
	
	public phpreport(destination:string, parameter:string, callback:(data:any)=>void){
         console.log(""+destination+" "+parameter+"");
		objexec.execute(""+destination+" "+parameter+"", function(data:any){
			callback(data);
		});		
	}
}

// let reportfile = "/usr/local/freeswitch/bin/fs_cli -x reloadxml";
