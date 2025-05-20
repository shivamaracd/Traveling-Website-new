import { Exec } from "./ExecExecute";
let objexec = new Exec();

export class PdfToTiff
{
	constructor(){}
	
	public pdftotiff(source:string, destination:string, callback:(data:any)=>void){
		objexec.execute("/usr/bin/convert -density 204x98 -units PixelsPerInch -resize 1728x1186\! -monochrome "+source+" "+destination+".tiff", function(data:any){
			callback(data);
		});		
	}
}