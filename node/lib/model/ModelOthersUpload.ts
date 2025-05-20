import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";
/* import { Exec } from "./ExecExecute"; */
import { UploadDirectory } from "../../config/setting.config";
import md5 from 'md5';
var fs = require('fs');
const d: Date = new Date();
export class ModelOtherUpload extends ModelObject {
	constructor(req: Request, res: Response) {
		super(req, res);
		this.type = "INSERT";
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
		var data = [finelfile, uploaddir.UPLOADSDIR,tmp_path];
        return data;
	}


	public AudioUpload()
	{
		console.log(this.req.file);
		var uploaddir 			= new UploadDirectory();
		var fullname 			= this.req.file.originalname.split(".");
		//var finelfile 			= fullname[0].replace(/ /g,"_")+"_"+(new Date().getTime())+'.'+fullname[1];
		var finelfile           = md5(fullname[0].replace(/ /g, "_") + "_" + (new Date().getTime()))+'.'+fullname[1];
		var target_path 		= uploaddir.UPLOADSVOICEDIR+finelfile;
		var tmp_path 			= this.req.file?.path;       
        var src 				= fs.createReadStream(tmp_path);
        var dest 				= fs.createWriteStream(target_path);
		src.pipe(dest);
		var data = [this.req.file.originalname, uploaddir.UPLOADSVOICEDIR, tmp_path,this.req.file.size, finelfile ];
        return data;

		// console.log(this.req.file);
		// var uploaddir = new UploadDirectory();
		// var fullname = this.req.file.originalname.split(".");
		// var finelfile = fullname[0] + "_" + (new Date().getTime()) + '.' + fullname[1];
		// var target_path = uploaddir.UPLOADSVOICEDIR + finelfile;
		// var tmp_path = this.req.file.path;
		// var src = fs.createReadStream(tmp_path);
		// var dest = fs.createWriteStream(target_path);
		// src.pipe(dest);
		// var data = [finelfile, uploaddir.UPLOADSVOICEDIR, tmp_path, this.req.file.size];
		// return data;
	}

	public fileDtmfUpload()
	{
		console.log(this.req.file);
		var uploaddir 			= new UploadDirectory();
		var fullname 			= this.req.file.originalname.split(".");
		//var finelfile 			= fullname[0].replace(/ /g,"_")+"_"+(new Date().getTime())+'.'+fullname[1];
		var finelfile           = md5(fullname[0].replace(/ /g, "_") + "_" + (new Date().getTime()))+'.'+fullname[1];
		var target_path 		= uploaddir.UPLOADSDTMFDIR+finelfile;
		var tmp_path 			= this.req.file?.path;       
        var src 				= fs.createReadStream(tmp_path);
        var dest 				= fs.createWriteStream(target_path);
		src.pipe(dest);
		var data = [this.req.file.originalname, uploaddir.UPLOADSDTMFDIR, tmp_path, this.req.file.size, finelfile];
        return data;


		// console.log(this.req.file);
		// var uploaddir = new UploadDirectory();
		// var fullname = this.req.file.originalname.split(".");
		// var finelfile = fullname[0] + "_" + (new Date().getTime()) + '.' + fullname[1];
		// var target_path = uploaddir.UPLOADSDTMFDIR + finelfile;
		// var tmp_path = this.req.file.path;
		// var src = fs.createReadStream(tmp_path);
		// var dest = fs.createWriteStream(target_path);
		// src.pipe(dest);
		// var data = [finelfile, uploaddir.UPLOADSDTMFDIR, tmp_path, this.req.file.size];
		// return data;
	}

	public imageUpload()
	{
		console.log(this.req.file);
		var uploaddir = new UploadDirectory();
		var fullname = this.req.file.originalname.split(".");
		var finelfile = fullname[0] + "_" + (new Date().getTime()) + '.' + fullname[1];
		var target_path = uploaddir.IMGUPLOADSDIR + finelfile;
		var tmp_path = this.req.file.path;
		var src = fs.createReadStream(tmp_path);
		var dest = fs.createWriteStream(target_path);
		src.pipe(dest);
		var data = [finelfile, uploaddir.IMGUPLOADSDIR, tmp_path];
		return data;
	}

	public CompanyDocument()
	{
		console.log(this.req.file);
		var uploaddir = new UploadDirectory();
		var fullname = this.req.file.originalname.split(".");
		var finelfile = fullname[0] + "_" + (new Date().getTime()) + '.' + fullname[1];
		var target_path = uploaddir.COMPANYDOCS + finelfile;
		var tmp_path = this.req.file.path;
		var src = fs.createReadStream(tmp_path);
		var dest = fs.createWriteStream(target_path);
		src.pipe(dest);
		var data = [finelfile, uploaddir.COMPANYDOCS, tmp_path];
		return data;
	}

	public prepare(): boolean {
		return true;
	}

	public execute(callback: (error: any, data: any) => void) { }
}