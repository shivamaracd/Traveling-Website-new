import { Request, Response, NextFunction } from "express";

export abstract class UserInterface
{
	protected _data:any;
	protected _status:boolean;
	protected response: Response;

	public constructor(res : Response)
	{	
		this.response=res;
		this._status=false;
	}

	public set status(v : boolean) {
		this._status = v;
	}
	
	public abstract prepare(result:any):void;

	public abstract execute():void;
}

export class UserBlank extends UserInterface
{
	public prepare(){}

	public execute(){}
}
