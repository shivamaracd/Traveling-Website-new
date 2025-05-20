import {Database} from "./Database";
import {MysqlManager} from "./MysqlManager";
import {Log} from './log';

export class Procedure
{
	private connection:Database;
	private data:any;
	private log:any;
	private _status:boolean;
	private _procedure:any;	
	private _isProcedure:boolean=false;
	private _isSQL:boolean=false;

	constructor()
	{
		this.log= new Log();
		this.connection=new MysqlManager();
		this._status=false;
		this._procedure="";
	}

	public get isSQL():boolean{
		return this._isSQL;
	}
	public set isSQL(val){
		this._isSQL=val;
	}

    public get sql():string{
		return this.connection.sql;
	}
	public set sql(val){
		this.connection.sql=val;
	}

	public prepare()
	{
		this.log.Debug("Query procedure is set to :"+this._procedure);
		let sql;
		if(this._isSQL)
		{
			sql=this.connection.sql;
		}else{
            sql='';
        }

        if(!this._isProcedure)
			this.connection.data=this._procedure;

		this.connection.sql=sql;
		console.log(sql);
		this.log.Debug("End of Calling prepare function in ModelProcedure");
	}

	public rawprepare()
	{
		let sql="";
		if(this._isSQL)
			sql=this.connection.sql;
		else
			return;
		
		if(!this._isProcedure)
			this.connection.data=this._procedure;

		this.connection.sql=sql;
		this.log.Debug("End of Calling rawprepare function in ModelProcedure");
	}

	public raw_prepare()
	{
		this.log.Debug("Raw Prepare Called :"+this.connection.sql);
		//this.connection.sql=sql;
	}
	
	public Raw_Execute(callback:(error:any, data:any)=>void)
	{
		if(typeof callback === 'function'){
			console.log("ModelProcedure with callback function in RawExecute Function, with query :"+this._procedure);
			this.connection.Open();
			this.data=this.connection.RawExecute((err: any, data:any)=>{
				// console.log(data);
				callback(err, data);
				this.connection.Close();
			});
			// this.connection.Close();
			// delete this.connection.sql;
			delete this._procedure;		
		}
		else
		{
			console.log("ModelProcedure with Invalid callback function in RawExecute Function");
		}
	}

	public Execute(callback:(error:any, data:any)=>void)
	{
		
		if(typeof callback === 'function'){
			console.log("ModelProcedure with callback function in Execute Function, with query :"+this._procedure);
			this.connection.Open();
			this.data=this.connection.Execute((err: any, data:any)=>{
				// console.log(data);
				callback(err, data);
				this.connection.Close();
			});
			//this.connection.Close();
			// delete this.connection.sql;
			delete this._procedure;	
		}
		else
		{
			console.log("ModelProcedure with Invalid callback function in Execute Function");
		}
	}

	public DataSet(callback:(error:any, data:any)=>void)
	{
		if(typeof callback === 'function'){
			console.log("ModelProcedure with callback function in DataSet Function, with query :"+this._procedure);
			this.connection.Open();
			this.data=this.connection.DataSet((err: any, data:any)=>{
				// console.log(data);
				callback(err, data);
				this.connection.Close();
			});
			//this.connection.Close();
			// delete this.connection.sql;
			delete this._procedure;
		}
		else
		{
			console.log("ModelProcedure with Invalid callback function in DataSet Function.");
		}
	}

	public Row(callback:(error:any, data:any)=>void)
	{
		if(typeof callback === 'function'){
			console.log("ModelProcedure with callback function in Row Function, with query :"+this._procedure);
			this.connection.Open();
			this.data=this.connection.Row((err: any, data:any)=>{
				// console.log(data);
				callback(err, data);
				this.connection.Close();
			});
			//this.connection.Close();
			// delete this.connection.sql;
			delete this._procedure;
		}
		else
		{
			console.log("ModelProcedure with Invalid callback function in Row Function.");
		}
		
	}
}
