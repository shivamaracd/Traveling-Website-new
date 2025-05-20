import { MongoConfig } from "../../config/setting.config";

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

export class MongoDB{
    private  client;
    private _type:number=-1;
    private _table:string="";
    private _fields:{[k:string]:any}={};
    private _filter:any;
    private _filter2:any=undefined;
    private _group:any;
    private _project:any;
    private _sort:any;
    private _query:any=[];
    private mdbuser:MongoConfig;

    constructor(){
        this.mdbuser=new MongoConfig();
        this.client=new MongoClient("mongodb://"+this.mdbuser.USER+":"+this.mdbuser.PASS+"@"+this.mdbuser.HOST+":"+this.mdbuser.PORT+"");
       
    }

    public get Table(){
		return this._table;
	}

	public set Table(val){
		this._table= val;
	}

	public get Type(){
		return this._type;
	}

	public set Type(val){
		this._type= val;
	}

    public Filter(data?:any, sessdata?:any){
        if(data==undefined)
            return "";
        console.log(data);
        let filter1:{[k:string]:any}={};
        let filter2:{[k:string]:any}={};
        Object.entries(data).forEach((key:any)=>{
            this._fields[key[0]]=key[1];
            if(key[0]=="date")
                filter2["date"]=key[1];
            else
                filter1[key[0]]=key[1];
        });
        if(sessdata.type==4)
            filter1["agent"]=sessdata.username;
        if(sessdata.type==5)
            filter1["appsetter"]=sessdata.username;
        if(sessdata.type==3)
            filter1["agency"]=sessdata.username;
        if(sessdata.type==3)
            filter1["company"]=sessdata.username;
        this._filter={$match: filter1};
        this._filter2={$match: filter2};
    }

    public GroupBy(data:any, field:any){
        let tmp:{[k:string]:any}={};
        let fld:{[k:string]:any}={};
        field.forEach((ele:any) => {
            console.log(field);
            Object.entries(ele).forEach((e:any)=>{
                /*if(e[0]=="__hourly"){
                    this._sort={"$sort":{"date":1}};
                    fld["date"]={$dateToString:{format:"%Y-%m-%d",date:{$toDate:"$"+e[1]}}};
                    fld["hour"]={$dateToString:{format:"%H",date:{$toDate:"$"+e[1]}}};
                    this._fields["date"]="$_id.date";
                    this._fields["hour"]="$_id.hour";
                }
                else if(e[0]=="__daily"){
                    this._sort={"$sort":{"date":1}};
                    fld["date"]={$dateToString:{format:"%Y-%m-%d",date:{$toDate:"$"+e[1]}}};
                    this._fields["date"]="$_id.date";
                }
                else if(e[0]=="__monthly"){
                    this._sort={"$sort":{"month":1}};
                    fld["month"]={$dateToString:{format:"%Y-%m",date:{$toDate:"$"+e[1]}}};
                    this._fields["month"]="$_id.month";
                }
                else{*/
                    fld[e[0]]="$"+e[1];
                    this._fields[e[1]]="$_id."+e[0];
                //}
            });
        });
        //console.log(JSON.stringify(fld));
        tmp={"_id":fld};
        data.forEach((ele:any) => {
            Object.entries(ele).forEach((e:any)=>{
                if(e[0]=="count")
                    tmp[e[1]]={$sum: 1};
                else if(e[0]=="sum")
                    tmp[e[1]]={$sum: "$"+e[1]};
                
                this._fields[e[1]]="$"+e[1];
            });
        });
        this._group={$group : tmp}
    }

    public Project(){
        this._project={$project:this._fields};
    }

    public prepare(){
        if(this._filter!=undefined)
            this._query.push(this._filter);
        this._query.push(this._group);
        this._query.push(this._project);
        if(this._filter2!=undefined)
            this._query.push(this._filter2);
        if(this._sort!=undefined)
            this._query.push(this._sort);
    }

    public execute(callback:any) {
        console.log(JSON.stringify(this._query));
        return this.client.connect((err:any)=>{
            assert.equal(null, err);
            console.log('Connected successfully to server');
            const db = this.client.db(this.mdbuser.NAME);
            const collection = db.collection(this._table);
            
            if(this._type==1){
                collection.find(this._query[0]).project(this._query[1]).toArray((errdoc:any, docs:any)=>{
                    assert.equal(errdoc, null);
                    callback(docs);
                });
            }
            else{
                console.log(JSON.stringify(this._query));
                collection.aggregate(this._query).toArray((errdoc:any, docs:any)=>{
                    assert.equal(errdoc, null);
                    callback(docs);
                  });
            }
        });
    }

    getQuery(query:any, callback:any) {
        console.log('connecting to mongo')
        return this.client.connect((err:any)=>{
            assert.equal(null, err);
            console.log('Connected successfully to server');

            const db = this.client.db(this.mdbuser.NAME);
            const collection = db.collection(this._table);

            if(this._type==1){
                collection.find(query[0]).project(query[1]).toArray((errdoc:any, docs:any)=>{
                    assert.equal(errdoc, null);
                    callback(docs);
                });
            }
            else{
                collection.aggregate(query).toArray((errdoc:any, docs:any)=>{
                    assert.equal(errdoc, null);
                    callback(docs);
                  });
            }
        });
    }
}