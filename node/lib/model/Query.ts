import {Database} from "./Database";
import {MysqlManager} from "./MysqlManager";
import {Log} from './log';

export class Query
{
	private connection:Database;
	private data:any;
	private log:any;
	private _status:boolean;
	private _filter:any;	
	private _table:string;	
	private _field:any[];
	private _group:any[];
	private _order:any[];
	private _isgroup:boolean=false;
	private _isorder:boolean=false;
	private _isfilter:boolean=false;
	private _isSQL:boolean=false;
	private _limit:number=-1;
	private _where:boolean=false;

	constructor()
	{
		this.log= new Log();
		this.connection=new MysqlManager();
		this._status=false;
		this._table="";
		this._field=[];
		this._group=[];
		this._order=[];
		
	}

	public get field(){
		return this._field;
	}
	public set field(val:any[]){
		this._field=val;
	}

	public get table():string{
		return this._table;
	}
	public set table(val){
		this._table=val;
	}

	public get where(){
		return this._where;
	}
	public set where(val:boolean){
		this._where=val;
	}

	public get isSQL():boolean{
		return this._isSQL;
	}
	public set isSQL(val){
		this._isSQL=val;
	}

	public get isfilter():boolean{
		return this._isfilter;
	}
	public set isfilter(val){
		this._isfilter=val;
	}

	public get isgroup():boolean{
		return this._isgroup;
	}
	public set isgroup(val){
		this._isgroup=val;
	}

	public get isorder():boolean{
		return this._isorder;
	}
	public set isorder(val){
		this._isorder=val;
	}

	public get filter():any{
		return this._filter;
	}
	public set filter(val){
		this._filter=val;
	}

	public get sql():string{
		return this.connection.sql;
	}
	public set sql(val){
		this.connection.sql=val;
	}

	public get status():boolean{
		return this._status;
	}

	public set group(val){
		this._group=val;
	}

	public get group(){
		return this._group;
	}

	public set order(val){
		this._order=val;
	}

	public get order(){
		return this._order;
	}

	public set limit(val:number){
		this._limit=val;
	}

	public get limit(){
		return this._limit;
	}
	
	public prepare()
	{
		this.log.Debug("Query table is set to :"+this._table);
		let sql;
		if(this._isSQL)
		{
			sql=this.connection.sql;
		}
		else
			sql="SELECT ?? FROM `"+this._table+"`";
		var tmp3="";
		if(this._isfilter)
		{
			console.log(this._filter);
			Object.entries(this._filter).forEach(
				([key, value]) => {console.log(key, value); tmp3 +="`"+key+"`='"+value+"' AND ";}
			);
			tmp3=tmp3.replace(/ AND\s*$/, "");
			sql=sql+" WHERE "+tmp3;
		}

		if(!this._isSQL)
			this.connection.data=[this._field];
		if(this._isgroup)
		{
			sql=sql+" GROUP BY "+this._group;
		}
		if(this._isorder)
		{
			sql=sql+" ORDER BY "+this._order;
		}

		if(this._limit>0)
		{
			sql=sql+" LIMIT "+this._limit;
		}

		this.connection.sql=sql;
		console.log(sql);
		this.log.Debug("End of Calling prepare function in Query");
	}

	public rawprepare()
	{
		let sql="";
		if(this._isSQL)
			sql=this.connection.sql;
		else
			return;
		
		var tmp3="";
		if(this._isfilter)
		{
			console.log(this._filter);
			Object.entries(this._filter).forEach(
				([key, value]) => {console.log(key, value); tmp3 +=""+key+"='"+value+"' AND ";}
			);
			tmp3=tmp3.replace(/ AND\s*$/, "");
			if(this._where)
				sql=sql+" WHERE "+tmp3;
			else
				sql=sql+tmp3;
		}
		else
		{
			sql=sql.replace(/ AND\s*$/, "");
		}

		if(!this._isSQL)
			this.connection.data=[this._field];
		if(this._isgroup)
		{
			sql=sql+" GROUP BY "+this._group;
		}
		if(this._isorder)
		{
			sql=sql+" ORDER BY "+this._order;
		}

		if(this._limit>0)
		{
			sql=sql+" LIMIT "+this._limit;
		}

		this.connection.sql=sql;
		this.log.Debug("End of Calling prepare function in Query");
	}

	public raw_prepare()
	{
		this.log.Debug("Raw Prepare Called :"+this.connection.sql);
		//this.connection.sql=sql;
	}
	
	public Raw_Execute(callback:(error:any, data:any)=>void)
	{
		if(typeof callback === 'function'){
			console.log("Query with callback function in RawExecute Function, with query :"+this.sql);
			this.connection.Open();
			this.data=this.connection.RawExecute((err: any, data:any)=>{
				// console.log(data);
				callback(err, data);
				this.connection.Close();
			});
			// this.connection.Close();
			delete this.connection.sql;
			delete this._filter;		
			delete this._table;		
		}
		else
		{
			console.log("Query with Invalid callback function in RawExecute Function");
		}
	}

	public Execute(callback:(error:any, data:any)=>void)
	{
		
		if(typeof callback === 'function'){
			console.log("Query with callback function in Execute Function, with query :"+this.sql);
			this.connection.Open();
			this.data=this.connection.Execute((err: any, data:any)=>{
				// console.log(data);
				callback(err, data);
				this.connection.Close();
			});
			//this.connection.Close();
			delete this.connection.sql;
			delete this._filter;		
			delete this._table;		
		}
		else
		{
			console.log("Query with Invalid callback function in Execute Function");
		}
	}

	public DataSet(callback:(error:any, data:any)=>void)
	{
		if(typeof callback === 'function'){
			console.log("Query with callback function in DataSet Function, with query :"+this.sql);
			this.connection.Open();
			this.data=this.connection.DataSet((err: any, data:any)=>{
				// console.log(data);
				callback(err, data);
				this.connection.Close();
			});
			//this.connection.Close();
			delete this.connection.sql;
			delete this._filter;		
			delete this._table;		
		}
		else
		{
			console.log("Query with Invalid callback function in DataSet Function.");
		}
	}

	public Row(callback:(error:any, data:any)=>void)
	{
		if(typeof callback === 'function'){
			console.log("Query with callback function in Row Function, with query :"+this.sql);
			this.connection.Open();
			this.data=this.connection.Row((err: any, data:any)=>{
				// console.log(data);
				callback(err, data);
				this.connection.Close();
			});
			//this.connection.Close();
			delete this.connection.sql;
			delete this._filter;		
			delete this._table;		
		}
		else
		{
			console.log("Query with Invalid callback function in Row Function.");
		}
		
	}
}
