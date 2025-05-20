import { ModelObject } from "./ModelObject";
var exec = require('child_process').exec;

export class Exec
{
	public execute(command:any, callback:(data:any)=>void){
		exec(command, (error:string, stdout:string, stderr:string)=>{ 
			callback(stdout); 
			console.log("Output ["+command+"] "+stdout);
			console.log("Error ["+command+"]  "+stderr);    
		});
	}
}