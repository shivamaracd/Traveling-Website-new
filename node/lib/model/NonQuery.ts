import {MysqlManager} from "./MysqlManager";
import {Log} from './log';
import { Database } from "./Database";

export class NonQuery
{
	private connection:Database;
	private log:any;
	private _data:any;
	private _table:string;
	private _type:string;
	private _filter:any;
	private _isfilter:boolean=false;

	constructor()
	{
		this.connection=new MysqlManager();
		this.log= new Log();
		this._table="";
		this._type="";
	}
	
	public get data(){
		return this._data;
	}
	public set data(val){
		this._data=val;
	}

	public get table():string{
		return this._table;
	}
	public set table(val){
		this._table=val;
	}

	public get type():string{
		return this._type;
	}
	public set type(val){
		this._type=val;
	}

	public get filter(){
		return this._filter;
	}
	public set filter(val){
		this._filter=val;
	}

	public get isfilter():boolean{
		return this._isfilter;
	}
	public set isfilter(val){
		this._isfilter=val;
	}

	public get sql():string{
		return this.connection.sql;
	}
	public set sql(val){
		this.connection.sql=val;
	}

	public get last():number
	{
		return this.last;
	}	
	
	public prepare()
	{
		this.log.Debug("Your table is set to :"+this._table);
		var sql="";	
		var tmp3="";	

		if(this._table.toString().length > 0)
		{	
			switch(this._type.toUpperCase())
			{
				case 'INSERT':
				{				
					sql="INSERT INTO `"+this._table+"` SET ? ";
					this.connection.data=this._data;
					break;
				}
				case 'UPDATE':
				{
					if(this._isfilter)
					{
						Object.entries(this._filter).forEach(
							([key, value]) => {console.log(key, value); tmp3 +="`"+key+"`='"+value+"' AND ";}
						);
						tmp3=tmp3.replace(/ AND\s*$/, "");
						this.log.Debug("Called with data and filter");
						sql="UPDATE `"+this._table+"` SET ? WHERE "+tmp3;
						//this.connection.data=[this._data, this._filter];
						this.connection.data=[this._data];
					}
					else
					{
						this.log.Debug("Called with only data");
						sql="UPDATE `"+this._table+"` SET ?";
						this.connection.data=this._data;
					}
					console.log(this.connection);
					break;
				}
				case 'DELETE':
				{
					if(this._isfilter)
					{
						Object.entries(this._filter).forEach(
							([key, value]) => {console.log(key, value); tmp3 +="`"+key+"`='"+value+"' AND ";}
						);
						tmp3=tmp3.replace(/ AND\s*$/, "");
						sql="DELETE FROM `"+this._table+"` WHERE "+tmp3;
						//this.connection.data=this._filter;
					}
				}
				default:
					this.log.Debug("Request type is not defined(INSERT/UPDATE/DELETE) properly.");
			}
		}
		else{
			this.log.Debug("Table is not defined properly.");
			return;
		}
		console.log(sql);
		this.connection.sql=sql;
	}

	public raw_prepare()
	{
		this.log.Debug(this.connection.sql);
		//this.connection.sql=sql;
	}

	Raw_Execute(callback:(error:any, data:any)=>void)
	{
		this.log.Debug("Calling Raw Execute function in NonQuery");
		this.connection.Open();
		this.connection.RawExecute((err: any, data:any)=>{
			callback(err, data);
		});
		this.connection.Close();
		delete this.connection.sql;
		delete this._type;
		delete this._filter;	
		delete this._table;
		this.log.Debug("End of Calling Raw Execute function in NonQuery");
	}

	public Execute(callback:(error:any, data:any)=>void)
	{
		this.log.Debug("Calling Execute function in NonQuery");
		this.connection.Open();		
		this.connection.NonExecute((err: any, data:any)=>{				
			callback(err, data);
		})		
		this.connection.Close();
		delete this.connection.sql;
		delete this._type;
		delete this._filter;	
		delete this._table;
		this.log.Debug("End of Calling Execute function in NonQuery");		
	}

	LoadFileExecute(callback:(error:any, data:any)=>void)
	{
		this.log.Debug("Calling Raw Execute function in NonQuery");
		this.connection.Open();
		this.connection.LoadFile((err: any, data:any)=>{
			callback(err, data);
		});
		this.connection.Close();
		delete this.connection.sql;
		delete this._type;
		delete this._filter;	
		delete this._table;
		this.log.Debug("End of Calling Raw Execute function in NonQuery");
	}
}