import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";
import { UploadDirectory } from "../../config/setting.config";
var fs = require('fs');

export class ModelCsvUpload extends ModelObject
{
	constructor(req:Request, res:Response)
	{
		super(req, res);
		this.type="INSERT";		
	}

	public fileUpload()
	{
		
		console.log(this.req.file);
		var uploaddir 			= new UploadDirectory();
		var fullname 			= this.req.file.originalname.split(".");
		var finelfile 			= fullname[0].replace(/ /g,"_")+"_"+(new Date().getTime())+'.'+fullname[1];
		var target_path 		= uploaddir.UPLOADSDIR+finelfile;
		var tmp_path 			= this.req.file?.path;       
        var src 				= fs.createReadStream(tmp_path);
        var dest 				= fs.createWriteStream(target_path);
		src.pipe(dest);
		var data = [finelfile, uploaddir.UPLOADSDIR, tmp_path, this.req.file.size,this.req.file.mimetype, this.req.file?.originalname,target_path];
        return data;
	}

	public setting()
	{
		console.log('original file name',this.req.file);
		var uploaddir 			= new UploadDirectory();
		var fullname 			= this.req.file.originalname.split(".");
		var finelfile 			= fullname[0].replace(/ /g,"_")+"_"+(new Date().getTime())+'.'+fullname[1];
		var target_path 		= uploaddir.SETTINGDIR+finelfile;
		var tmp_path 			= this.req.file?.path;       
        var src 				= fs.createReadStream(tmp_path);
        var dest 				= fs.createWriteStream(target_path);
		src.pipe(dest);
		var data = [finelfile, uploaddir.SETTINGDIR,tmp_path];
        return data;
	}
	
	public prepare():boolean
	{
		var ret = true;
		
		if(this.req.file?.mimetype == "text/plain" || this.req.file?.mimetype == "text/csv")
		{
			console.log("Invalid File type");
			ret=true;
		}
		else
		{
			ret=false;
		}
		
		if(this.table.length < 1 || this.table==null)
		{
			console.log("Table is not defined properly.");
			ret=false;
		}

		if(this.req.body.hasOwnProperty('data'))
		{
			this.nonquery.data=this.req.body.data;
		}
		else
		{
			console.log("Data is not found into the request");
			ret=false;
		}			

		return ret;
		
	}
	public execute(callback:(error: any, data:any)=>void)
	{		
		this.log.Debug("Calling Add function in ModelObject.");
		//this.nonquery.prepare();
		this.nonquery.LoadFileExecute((err: any, data:any)=>{			
			this.respond(err, data, callback);
		});
	}
}