import {Log} from './log';
import {DataBaseConfig} from '../../config/setting.config';

export abstract class Database
{
	protected connection:any;
	public log:any;
	protected _data:any;
	protected user:string;
	protected pass:string;
	protected hostip:string;
	protected dbase:string;
	protected dbport:number;
	protected _sql:string;
	protected _last:number=-1;
	
	constructor()
	{	
		this.log= new Log();
		let db=new DataBaseConfig();
		this.user=db.USER;
		this.pass=db.PASS;
		this.hostip=db.HOST;
		this.dbase=db.NAME;
		this.dbport=parseInt(db.PORT);
		this._sql="";
	}

	public get data(){
		return this._data;
	}
	public set data(val){
		this._data=val;
	}

	public get last():number
	{
		return this._last;
	}

	public get sql():string
	{
		return this._sql;
	}
	public set sql(val)
	{
		this._sql=val;
	}

	public get username():string
	{
		return this.user;
	}
	public set username(val)
	{
		this.user=val;
	}

	public get password():string
	{
		return this.pass;
	}
	public set password(val)
	{
		this.pass=val;
	}

	public get host():string
	{
		return this.hostip;
	}
	public set host(val)
	{
		this.hostip=val;
	}
	public get port():number
	{
		return this.dbport;
	}
	public set port(val)
	{
		this.dbport=val;
	}

	public get database():string
	{
		return this.dbase;
	}
	public set database(val)
	{
		this.dbase=val;
	} 

    public abstract Open():any;

	public abstract Close():any;
	
	public abstract RawExecute(callback:(error:any, data: any)=>void):void;

    public abstract Execute(callback:(error:any, data: any)=>void):void;

	public abstract Row(callback:(error:any, data: any)=>void):void;

    public abstract NonExecute(callback:(error:any, data: any)=>void):void;
	
	public abstract DataSet(callback:(error:any, data: any)=>void):void;

	public abstract Delete(callback:(error:any, data: any)=>void):void;

	public abstract LoadFile(callback:(error:any, data: any)=>void):void;

	
	// public abstract status(values);
}