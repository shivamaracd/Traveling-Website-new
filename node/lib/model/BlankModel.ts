import { Request, Response, NextFunction } from "express";
import { ModelObject } from "./ModelObject";

export class Blank extends ModelObject{
	public prepare():boolean { console.log("Calling blank prepare function"); return false;}	

	public execute(callback:any){console.log("Calling blank execute function");}
}