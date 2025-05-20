import { Database } from './Database';
import {Log} from './log';
var mysql = require('mysql');

export class MysqlManager extends Database
{
	
	constructor()
	{	
		super();
	}

    Open()
    {
        this.log.Debug("Calling Open function in MysqlManager");
		if (this.dbase == null || this.dbase=="") 
		{
			this.log.Debug("MySQL database not selected, Error : ");
			return;
		}
			
        if (this.hostip==null || this.hostip=="") 
		{
			this.log.Debug("MySQL hostname not set, Error : ");
			return;
		}

		if (this.user==null || this.user=="") 
		{
			this.log.Debug("MySQL username not set, Error : ");
			return;
		}

		if (this.pass==null) 
		{
			this.log.Debug("MySQL password not set, Error : ");
			return;
		}
			
		if(this.port==3306 || this.port==0){
			this.connection = mysql.createConnection({
				host     : this.hostip,
				user     : this.user,
				password : this.pass,
				database : this.dbase,

				/* custom modification */
				multipleStatements: true,
				acquireTimeout: 1000000
			});

			/* this.connection.connect((err:any)=>{
				if(callback)
					callback(err);
			}); */
		}
		//else
		//	this.connection = mysql.createConnection(this.host+":"+this.port+":"+this.username+":"+this.database+":"+this.password);
    }

    Close()
    {
		this.log.Debug("Calling Close function in MysqlManager");
		try{
		this.connection.end();
		}
		catch(e)
		{
			console.log(e);
		}
	}
	
		public RawExecute(callback:(error:any, data:any)=>void)
    {
			this.log.Debug("Mysql Manager SQL QRY rawexecute : "+this._sql);
			this.connection.query(this._sql, function(error1:any, data:any){ 
				if(!error1)       
				{ 				
					callback(1, data);
					// console.log(data1);
				} 
				else
				{
					console.log("Mysql query error  : "+error1+""); 
					callback(10, error1);
				}
			});
		}

    public Execute(callback:(error:any, data:any)=>void)
    {
		this.log.Debug("Calling Execute function in MysqlManager");
		this.log.Debug(this._sql);
		this._sql= mysql.format(this._sql, this._data);
		this.log.Debug(this._sql);
		this.connection.query(this._sql, function(error:any, data:any){      
			if(!error)       
			{ 				
				callback(1, data);
			} 
			else
			{
				console.log("Mysql query error  : "+error+""); 
				callback(10, error);
			}
		
		});
	}

	public DataSet(callback:(error:any, data:any)=>void)
    {
		this.log.Debug("Calling Dataset function in MysqlManager Field ("+this._data+"), SQL : "+this._sql);
		this._sql= mysql.format(this._sql, this._data);
		console.log(this._sql);
		
		this.connection.query(this._sql, function(err:any, data:any){
			if(typeof callback === 'function')
				console.log("callback is a function");

			if(!err)
			{ 
				if(data.length > 0)
				{
					callback(1, data);
					console.log("End of Calling Dataset function in MysqlManager");
				}
				else
				{
					console.log("No data found");
					callback(2, "No data found");
				}				
			} 
			else
			{
				console.log("Mysql query error  : "+err+""); 
				callback(10, err);				
			}
		
		});
	}

	public Row(callback:(error:any, data:any)=>void)
	{
		this.log.Debug("Calling Row function in MysqlManager");
		this._sql= mysql.format(this._sql, this._data);
		this.log.Debug(this._sql);
        this.connection.query(this._sql, function(error:any, data:any){        
			if(!error)       
			{ 
				if(data.length > 0)
				{
					console.log("No of Rows return from Row function is "+data.length+".");
					console.log("End of Calling Row function in MysqlManager");
					callback(1, data[0]);
				}
				else
				{
					console.log("Null Data return");
					callback(2, "Null Data return");
				}
				
			} 
			else
			{
				console.log("Mysql query error  : "+error+"");  
				callback(10, error);
			}
		
		})
	}

    public NonExecute(callback:(error:any, data:any)=>void)
    {
		this._sql= mysql.format(this._sql, this._data);
		this.log.Debug("Executing query "+this._sql);	
		this.connection.query(this._sql, (error:any, data:any)=>{        
			if(!error)
			{ 
				this._last=data.insertId;
				if(this._last > 0)
				{
					console.log("No of Rows return from Row function is "+this._last+".");
					callback(1, data);
				}
				else
				{
					console.log("Null Data return");
					callback(2, data);
				}
			}
			else
			{
				console.log("Mysql query error  : "+error+""); 
				callback(10, error);
			}
    	});
	}

	public Delete(callback:(error:any, data:any)=>void)
    {
		this.log.Debug("Calling Delete function in MysqlManager");

		this.connection.query(this._sql, function(error:any, data:any){        
		if(!error)
		{ 
			console.log("End of Calling Delete function in MysqlManager");
			callback(1, {data: data});				
		} 
		else
		{
			console.log("Mysql query error  : "+error+""); 
			callback(10, error);
		}			
    	});
	}

	public LoadFile(callback:(error:any, data:any)=>void)
    {
		this.log.Debug("Calling Delete function in MysqlManager");

		this.connection.query(this._sql, function(error:any, data:any){        
			if(!error)
			{ 
				var last_id=data.insertId;
				if(last_id > 0)
				{
					console.log("No of Rows return from Row function is "+data.length+".");
					console.log("End of Calling Row function in MysqlManager");
					callback(1, {last: last_id});
				}
							
			} 
			else
			{
				console.log("Mysql query error  : "+error+""); 
				callback(10, error);
			}			
    	});
	}
}
