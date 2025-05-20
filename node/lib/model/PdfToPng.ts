import { Exec } from "./ExecExecute";
let objexec = new Exec();

export class PdfToPng
{
	constructor(){}
	
	public pdftopng(source:string, destination:string, callback:(data:any)=>void){
		console.log("/usr/bin/convert -density 300 -compress lzw -trim "+source+" -quality 10 "+destination+".png");
		objexec.execute("/usr/bin/convert -density 300 -compress lzw -trim "+source+" -quality 10 "+destination+".png", function(data:any){
			callback(data);
		});		
	}

	public PageCount(filename:string, callback:(error:any, data:any)=>void)
	{
		let obj=new Exec();
		obj.execute("/usr/bin/ls -la "+filename+"* | /usr/bin/wc -l", (data:any)=>{
			callback(1,data);
		})
	}
}