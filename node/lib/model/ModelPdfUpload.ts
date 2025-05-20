import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";
import { Exec } from "./ExecExecute";
import { Res405 } from "../view/405";
import { cursess } from "../../config/module.config";
var fs = require('fs');

export class ModelPdfUpload extends ModelObject
{
	constructor(req:Request, res:Response)
	{
		super(req,res);
		this.type="INSERT";		
	}

	public fileUpload()
	{
		console.log(this.req.file);
		var target_path = process.cwd() + "/uploads/" + this.req.file.originalname;
        var tmp_path = this.req.file.path;       
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
		src.pipe(dest);
		var data = [this.req.file.originalname, this.req.file.path];
        return data;
	}

	public prepare():boolean
	{
		var ret = true;		
		console.log("Current into prepare function of uploadfile=============");
		console.log(this.req.body.data);
		if(this.req.file.mimetype != "application/pdf")
		{
			console.log("Invalid File type");
			let objv = new Res405(this.res);
			objv.prepare({error: "No file Uploaded or Invalid file format"});
			objv.execute();  
			ret = false;
		}

		if(this.table.length < 1 || this.table==null)
		{
			console.log("Table is not defined properly.");
			ret = false;
		}

		if(this.req.body.data !="")
		{
			//this.nonquery.data=this.req.body.data;
			let time = Date.now();
    		let tiffile = 'file'+time; 
    
			this.nonquery.data = {
				filename:this.req.file.originalname,
				filepath:this.req.file.path,
				tiffile:tiffile,
				iduser:cursess.session.id
			}

			console.log(this.nonquery.data);
		}
		else
		{
			let objv = new Res405(this.res);
			objv.prepare({error: "Invalid request type"});
			objv.execute();  
			console.log("Data is not found into the request");
			ret = false;
		}
		console.log("End of prepare function of uploadfile=============with return "+ret);

		return ret;
		
	}

	public execute(callback:(error: any, data:any)=>void)
	{
		
		this.log.Debug("Calling Pdf Upload function in ModelObject.");		
		this.nonquery.prepare();
		this.nonquery.Execute((err: any, data:any)=>{
			data=Object.assign(this.nonquery.data, data);
			console.log(data);
			this.respond(err, data, callback);
		});
	}
}