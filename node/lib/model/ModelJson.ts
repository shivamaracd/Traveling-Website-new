"use strict";
var fs = require('fs');
export class WJson
{
	public createObject(edata:any, callback:(error: any, data:any)=>void){
        fs.writeFile (edata.directory, JSON.stringify(edata.JsObject), function(error: any,info:any) {
            // if (err) throw err;
            if (error) {
                console.log(error);
                callback(0, error);
            } else {
                console.log('Create file: ' + info);
                callback(1, info);
            }
            }
        );
	 }
}