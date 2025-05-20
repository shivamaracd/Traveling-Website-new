import { Request, Response, NextFunction } from "express";
import { ModelListView } from "./model/ModelListView";
import { ModelAdd } from "./model/ModelAdd";
import { ModelDelete } from "./model/ModelDelete";
import { AddData } from "./view/Add";
import { ListData } from "./view/Listview";
import { ModelUpdate } from "./model/ModelUpdate";
import { UpdateData } from "./view/Update";
import { DeleteData } from "./view/Delete";
import { Res404 } from "./view/404";
import { ModelRawQuery } from "./model/RawQuery";
import { RawView } from "./view/RawView";
import { Res405 } from "./view/405";
import { ModelPdfUpload } from "./model/ModelPdfUpload";
import { SessionManagment } from "./model/Session";
import { Res401 } from "./view/401";
import { Res403 } from "./view/403";
import { ModelLogin } from "./model/ModelLogin";
import { modLogin} from "../config/module.config";
import { Res406 } from "./view/406";
import { ModelRawNonQuery } from "./model/RawNonQuery";
import { ModelProcedure } from "./model/ModelProcedure";

export class Management
{
  protected _isfiltered:boolean=false;
  protected _filtered:any;
  protected _sessdata:any;
  protected req:Request;
  protected res:Response;
  protected next:NextFunction;

  constructor(req:Request, res:Response, next:NextFunction){
    this.req=req;
    this.res=res;
    this.next=next;
  }

  public set filtered(val:any)
  {
    if(val==undefined)
      return;
    if(val==null)
      return;
    if(val=="")
      return;
    
    this._isfiltered=true;
    this._filtered=val;
  }

  public set sessdata(val:any)
  {
    if(val==undefined)
    {
      let objv=new Res406(this.res)
      objv.prepare("Error in session");
      objv.execute();
    }
    if(val==null)
    {
      let objv=new Res406(this.res)
      objv.prepare("Error in session");
      objv.execute();
    }
    if(val=="")
    {
      let objv=new Res406(this.res)
      objv.prepare("Error in session");
      objv.execute();
    }
    this._sessdata=val;
  }
  
  public UploadFiles()
  {
    if(this._sessdata.error>0)
    {
      let objv=new Res406(this.res);
      objv.prepare("Error in session");
      objv.execute();
    }

    let objfile = new ModelPdfUpload(this.req,this.res);
    objfile.fileUpload();  
    if(objfile.prepare()){
      objfile.execute((error:any, result:any)=>{
        let objv = new AddData(this.res);
        objv.prepare(result);
        objv.execute();
      });
    }
  }    

  public RawQryList(){
      if(this._isfiltered)
      { 
        let obj=new ModelRawQuery(this.req, this.res);
        console.log("Into RawQry List function : "+this.req.url);      
        obj.qrysql = this._filtered.sqlqry;
        if(this._filtered.session!=undefined)
        {
          let tmp:any={};
          for (let index in this._filtered.session){
            tmp[index]=this._sessdata.session[this._filtered.session[index]];
          }
          /* Object.entries(this._filtered.session).forEach(
            ([key, value]) => {
              tmp[key]=this._sessdata.session[value.toString()];
          }); */

          if(obj.isfilter)
          {
            obj.filter=Object.assign(obj.filter, tmp);
          }
          else
            obj.filter=tmp;
          console.log(obj.filter);
        }
        if(this._filtered.group!=undefined)
          obj.group=this._filtered.group;
        if(this._filtered.order!=undefined)
          obj.order=this._filtered.order;
        if(this._filtered.limit!=undefined)
          obj.limit=this._filtered.limit;
        if(this._filtered.where!=undefined)
          obj.where=this._filtered.where;
        if(obj.prepare()){
          obj.execute((error:any, result:any)=>{
            console.log("Get RawQry List View Has completed at Management");
            let objv= new RawView(this.res);
            objv.prepare(result);
            objv.execute();
          });
        }
        else
        {
          let objv = new Res405(this.res);
          objv.prepare({error: "Few parameter are missing in request"});
          objv.execute();
        }
      }
      else
      {
        let objv = new Res404(this.res);
        objv.prepare({error: "From raw-query running management"});
        objv.execute();
      }
  }

  public Delete()
  {
      if(this._isfiltered)
      { 
        let obj= new ModelDelete(this.req,this.res);
        console.log(this.req.body);
        obj.table=this._filtered.table;
        if(this._filtered.filter!=undefined)
          obj.filter=this._filtered.filter;
        if(this._filtered.session!=undefined)
        {
          let tmp:any={};
          /* Object.entries(this._filtered.session).forEach(
            ([key, value]) => {
              tmp[key]=this._sessdata.session[value.toString()];
          }); */

          for (let index in this._filtered.session){
            tmp[index]=this._sessdata.session[this._filtered.session[index]];
          }

          if(obj.isfilter)
          {
            obj.filter=Object.assign(obj.filter, tmp);
          }
          else
            obj.filter=tmp;
          console.log(obj.filter);
        }
        if(obj.prepare()){
          obj.execute((error:any, result:any)=>{
            let objv = new DeleteData(this.res);
            objv.prepare(result);
            objv.execute();
          });
        }
        else{
          let objv = new Res405(this.res);
          objv.prepare({error: "Few parameter are missing in request"});
          objv.execute();
        }
      }
      else
      {
        let objv = new Res404(this.res);
        objv.prepare({error: "From Delete running management"});
        objv.execute();
      }
  }

  public Update()
  {
      if(this._isfiltered)
      { 
        let obj= new ModelUpdate(this.req,this.res);
        console.log(this.req.body.data);
        obj.table=this._filtered.table;
        if(this._filtered.filter!=undefined)
          obj.filter=this._filtered.filter;
        if(this._filtered.session!=undefined)
        {
          let tmp:any={};
          /* Object.entries(this._filtered.session).forEach(
            ([key, value]) => {
              tmp[key]=this._sessdata.session[value.toString()];
          }); */

          for (let index in this._filtered.session){
            tmp[index]=this._sessdata.session[this._filtered.session[index]];
          }

          if(obj.isfilter)
          {
            obj.filter=Object.assign(obj.filter, tmp);
          }
          else
            obj.filter=tmp;
          console.log(obj.filter);
        }
        if(obj.prepare(this._filtered.fields)){
          obj.execute((error:any, result:any)=>{
            let objv = new UpdateData(this.res);
            objv.prepare(result);
            objv.execute();
          });
        }
        else{
          let objv = new Res405(this.res);
          objv.prepare({error: "Few parameter are missing in request"});
          objv.execute();
        }
      }
      else
      {
        let objv = new Res404(this.res);
        objv.prepare({error: "From Update running management"});
        objv.execute();
      }
  }

  public Save()
  {
      if(this._isfiltered)
      { 
        let obj= new ModelAdd(this.req,this.res);
        obj.table=this._filtered.table;
        
        if(this._filtered.session!=undefined)
        {
          let tmp:any={};
          /* Object.entries(this._filtered.session).forEach(
            ([key, value]) => {
              tmp[key]=this._sessdata.session[value.toString()];
          }); */
          for (let index in this._filtered.session){
            tmp[index]=this._sessdata.session[this._filtered.session[index]];
          }

          obj.data=tmp;
        }
        console.log(this._filtered);
        if(obj.prepare(this._filtered.fields)){
          obj.execute((error:any, result:any)=>{
            let objv = new AddData(this.res);
            objv.prepare(result);
            objv.execute();
          });
        }
        else{
          let objv = new Res405(this.res);
          objv.prepare({error: "Few parameter are missing in request"});
          objv.execute();
        }
      }
      else
      {
        let objv = new Res404(this.res);
        objv.prepare({error: "From Save running management"});
        objv.execute();
      }
  }

  public ListView(){
      if(this._isfiltered)
      { 
        let obj = new ModelListView(this.req,this.res);
        console.log("Into Module List function : "+this.req.url);
        obj.table=this._filtered.table;
        obj.data=this._filtered.fields;
        
        if(this._filtered.filter!=undefined)
          obj.filter=this._filtered.filter;
        if(this._filtered.session!=undefined)
        {
          let tmp:any={};
          /* Object.entries(this._filtered.session).forEach(
            ([key, value]) => {
              tmp[key]=this._sessdata.session[value.toString()];
          }); */
          for (let index in this._filtered.session){
            tmp[index]=this._sessdata.session[this._filtered.session[index]];
          }

          if(obj.isfilter)
          {
            obj.filter=Object.assign(obj.filter, tmp);
          }
          else
            obj.filter=tmp;
          console.log("Current filter set "+obj.filter);
        }
        if(this._filtered.group!=undefined)
          obj.group=this._filtered.group;
        if(this._filtered.order!=undefined)
          obj.order=this._filtered.order;
        if(this._filtered.limit!=undefined)
          obj.limit=this._filtered.limit;
        
        if(obj.prepare())
        {
          obj.execute((error:any, result:any)=>{
            console.log("Get List View Has completed at Management");
            let objv= new ListData(this.res);
            objv.prepare(result);
            objv.execute();
          });
        }
        else{
          console.log("Error in Get List View at Management");
          let objv = new Res405(this.res);
          objv.prepare({error: "Few parameter are missing in request"});
          objv.execute();
        }
      }
      else
      {
        console.log("Error in listview");
        let objv = new Res404(this.res);
        objv.prepare({error: "From ListView running management"});
        objv.execute();
      }
  } 

  public OptionList(){
      if(this._isfiltered)
      { 
        let obj=new ModelRawQuery(this.req,this.res);
        console.log("Into Option List function : "+this.req.url);
        obj.qrysql="SELECT "+this._filtered.label+" `label`, "+this._filtered.value+" `value` FROM `"+this._filtered.table+"`";
        if(this._filtered.filter!=undefined)
          obj.filter=this._filtered.filter;
        if(this._filtered.session!=undefined)
        {
          let tmp:any={};

          /* Object.entries(this._filtered.session).forEach(
            ([key, value]) => {
              tmp[key]=this._sessdata.session[value.toString()];
          }); */
          for (let index in this._filtered.session){
            tmp[index]=this._sessdata.session[this._filtered.session[index]];
          }

          if(obj.isfilter)
          {
            obj.filter=Object.assign(obj.filter, tmp);
          }
          else
            obj.filter=tmp;
          
          console.log(obj.filter);
          obj.qrysql = obj.qrysql+" WHERE ";
        }
        
        if(obj.prepare())
        {
          obj.execute((error:any, result:any)=>{
            console.log("Get Option Has completed at Management");
            let objv= new ListData(this.res);
            objv.prepare(result);
            objv.execute();
          });
        }
        else{
          let objv = new Res405(this.res);
          objv.prepare({error: "Few parameter are missing option request"});
          objv.execute();
        }
      }
      else
      {
        let objv = new Res404(this.res);
        objv.prepare({error: "From OptionList running management"});
        objv.execute();
      }
  }

  public storedProcedure(){
    if(this._isfiltered)
    { 
      let obj=new ModelProcedure(this.req,this.res);
      console.log("Into storedProcedure List function : "+this.req.url);
      // obj.sqlProcedure="SELECT "+this._filtered.label+" `label`, "+this._filtered.value+" `value` FROM `"+this._filtered.table+"`";
      if(this.req.query.type!=='main'){
        obj.sqlProcedure="CALL "+this.req.query.type;
      }else{
        obj.sqlProcedure="CALL "+this._filtered.storedProcedure;
      }
      
      if(obj.prepare())
      {
        obj.execute((error:any, result:any)=>{
          console.log("Get storedProcedure Has completed at Management");
          let objv= new ListData(this.res);
          objv.prepare(result);
          objv.execute();
        });
      }
      else{
        let objv = new Res405(this.res);
        objv.prepare({error: "Few parameter are missing option request"});
        objv.execute();
      }
    }
    else
    {
      let objv = new Res404(this.res);
      objv.prepare({error: "From storedProcedure running management"});
      objv.execute();
    }
  }

  public NotFound()
  {
    console.log(this.req.url);
    let objv = new Res404(this.res);
    objv.prepare({error: "From wrong request running management"});
    objv.execute();
  }

  public UserLogin()
  {
    let obj=new ModelLogin(this.req, this.res);
    console.log("Current Body " + JSON.stringify(this.req.body));
    console.log("UserLogin method is called");
    if(obj.prepare()){
      obj.execute((error:any, result:any)=>{
		  if(error==2){
        let session=new SessionManagment(this.req,this.res,this.next);
        session.SetSession(result,(error,sessdata)=>{
          let objv= new RawView(this.res);
          objv.prepare(result);
          objv.execute();
        });
		  }else{
        let objv= new Res403(this.res);
        objv.prepare({error:"Invalid Username and password to set proper session"});
        objv.execute();
		  }
      });
    }
  }

  public UserLogout()
  {
    let session=new SessionManagment(this.req,this.res,this.next);
    let key=this.req.headers.hasOwnProperty("authorization");
    session.DeleteSession((error, data)=>{
      let objv= new RawView(this.res);
      objv.prepare({error:"User is logout successfully"});
      objv.execute();
    });
  }

  public ResetPasswprd()
  {
    let obj=new ModelRawNonQuery(this.req,this.res);
    let config = new modLogin();
    obj.nonqrysql="UPDATE `"+config.data.table+"` SET `password`='"+this.req.body.newpassword+"' WHERE id="+this.sessdata.session.id+" AND `password`='"+this.req.body.oldpassword+"'";
    if(obj.prepare())
    {
      obj.execute((error:any, data:any)=>{
        if(error==1)
        {
          let objv= new RawView(this.res);
          objv.prepare(data);
          objv.execute();
        }
      });
    }
  }
}