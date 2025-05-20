import { Request, Response, NextFunction } from "express";
import {NonQuery} from "./NonQuery";
import {Query} from "./Query";
import {Log} from './log';
import { Database } from "./Database";
import { Res405 } from "../view/405";
import { Res403 } from "../view/403";
import { SessionManagment } from "./Session";
import { Procedure } from "./Procedure";

export abstract class ModelObject
{
	protected query:Query;
	protected nonquery:NonQuery;
	protected procedure:Procedure;
	protected _isdata:boolean=false;
	protected _data:any;
	protected _filter:any;
	protected _isfilter:boolean=false;
	protected log:Log;
	protected req:Request;
	protected res:Response;
	
	constructor(req:Request, res:Response)
	{
		this.log= new Log();
		this.query = new Query();
		this.nonquery = new NonQuery();
		this.procedure = new Procedure();
		this.req=req;
		this.res=res;
	}

	public get data(){
		return this._data;
	}
	public set data(val){
		if(val==null)
			return;
		if(val=="")
			return;
			
		this._data=val;
		this._isdata=true;
	}

	/* public get isdata(){
		return this._isdata;
	}
	public set isdata(val){
		this._isdata=val;
	} */
 
	protected get type(){
		return this.nonquery.type;
	}
	protected set type(val){
		this.nonquery.type=val;
	}

	public get qrysql():string{
		return this.query.sql;
	}
	public set qrysql(val){
		if(val==null)
			return;
		if(val=="")
			return;
		this.query.isSQL=true;
		this.query.sql=val;
	}

	public get nonqrysql():string{
		return this.nonquery.sql;
	}
	public set nonqrysql(val){
		this.nonquery.sql=val;
	}

	public get filter():any{
		return this._filter;
	}
	public set filter(val){
		if(val==null)
			return;
		if(val=="")
			return;
		this._isfilter=true;
		this._filter=val;
	}

	public get isfilter():boolean{
		return this._isfilter;
	}
	public set isfilter(val){
		this._isfilter=val;
	}

	public get where() : boolean{
		return this.query.where;
	}

	public set where(val){
		this.query.where=val;
	}

	public get group() : any{
		return this.query.group;
	}

	public set group(val){
		if(val==null)
			return;
		if(val=="")
			return;
		this.query.isgroup=true;
		this.query.group=val;
	}

	public get order() : any{
		return this.query.order;
	}

	public set order(val){
		if(val==null)
			return;
		if(val=="")
			return;
		this.query.isorder=true;
		this.query.order=val;
	}

	public get limit() : number{
		return this.query.limit;
	}
	
	public set limit(val){
		if(val==null)
			return;
		if(val==-1)
			return;
		this.query.limit=val;
	}

	public get table() : string{
		return this.query.table;
	}

	public set table(val){
		this.nonquery.table=val;
		this.query.table=val;

	}

	public get sqlProcedure():string{
		return this.procedure.sql;
	}
	public set sqlProcedure(val){
		this.procedure.sql=val;
	}

	public abstract prepare(fields?:string[]):boolean;	

	public abstract execute(callback:any):void;

	protected respond(err:any, data:any, callback:any):void
	{
		switch(err)
		{
			case 1:
			{
				callback(err, data);
				break;
			}
			case 2:
			{//Login functionality need to implement
				callback(err, data);
				break;
			}
			case 5:
			{
				let objv = new Res405(this.res);
				objv.prepare({error: "No file Uploaded or Invalid file format"});
				objv.execute();
				break;
			}
			case 8:
			{
				let objv = new Res403(this.res);
				objv.prepare({error: "Invalid login credentials username/password"});
				objv.execute();
				break;
			}
			case 10:
			{
				let objv = new Res405(this.res);
				objv.prepare({error: "No file Uploaded or Invalid file format"});
				objv.execute();
				break;
			}
		}
	}
	
}