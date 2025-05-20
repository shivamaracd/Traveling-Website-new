// import {FormGroup,FormBuilder,Validators} from "@angular/forms";



// // export interface Package {
// //     iduser: number,
// //     name: string,
// //     sms_rate: number,
// //     ib_rate: number,
// //     ob_rate: number,
// //     did_rate: number,
// //     rvm_rate: number,
// //     agent_rate: number
// // }

// // export interface Apikeysetting {
// //     iduser:number,
// //     name:string,
// //     logo:File,
// //     type:string
// // }

// // export interface HTTPApikeysetting {
// //     iduser:number,
// //     name:string,
// //     logo:File,
// //     type:string
// // }


// // export class ApikeysettingForm implements HTTPApikeysetting {
// //     public iduser: number;
// //    public name:string;
// //    public logo:File;
// //    public type:string;

// //    constructor(data:Apikeysetting){
// // if(data==null){
// //     this.iduser=parseInt(sessionStorage.getItem('iduser'));
// //     this.name="";
// //     // this.logo="";
// //     this.type="";
// // }
// // else{
// //     this.iduser=parseInt(sessionStorage.getItem('iduser'));
// //     this.name=data.name;
// //     this.type=data.type;
// //     this.logo=data.logo;
// // }
// //    }


    
// // }

// // public_key
// // secrete_key
// export interface Signalmash {
//     public_key:string,
//     secrete_key:string,
//     type:string,
// }

// export interface HTTPSingnalmash {
//     public_key:string,
//     secrete_key:string,
//     type:string,
// }

// export class SingnalmashForm implements HTTPSingnalmash {
//     public public_key: string;
//     public secrete_key: string;
//     public type: string;
//     constructor(data:Signalmash){
// if(data=null){
//     this.public_key='';
//     this.secrete_key='';
//     this.type='Signalmash';
// }
// else {
//     this.public_key=data.public_key;
//     this.secrete_key=data.secrete_key;
//     this.type=data.type;
// }
//     }
    

// public makeform(fb:FormBuilder):FormGroup{
//     return fb.group({
//         public_key:[this.public_key,[Validators.required]],
//         secrete_key:[this.secrete_key,[Validators.required]],
//         type:[this.type,[Validators.required]]
//     });
// }



// public saveForm(fg:FormGroup):boolean {
//     if(fg.valid){
//         this.public_key=fg.get("public_key").value;
//         this.secrete_key=fg.get("secrete_key").value;
//         this.type=fg.get("type").value;
//         return true;
//     }
//     else {
//         return false;
//     }
// }

// }

// export interface Telnyx {
//     public_key:string,
//     secrete_key:string,
// }
// export interface HTTPTelnyx {
//     public_key:string,
//     secrete_key:string,
// }

// export class TelnyxForm implements HTTPTelnyx {
//     public public_key: string;
//     public secrete_key: string;
//     constructor (data:Telnyx){
//         if(data==null){
//             this.public_key='';
//             this.secrete_key='';
//         }
//         else {
//             this.public_key=data.public_key
//             this.secrete_key=data.secrete_key
//         }
//     }


// public makeform(fb:FormBuilder):FormGroup{
//     return fb.group({
//         public_key:[this.public_key,[Validators.required]],
//         secrete_key:[this.secrete_key,[Validators.required]],
//     })

// }



// public saveForm(fg:FormGroup):boolean{
//     if(fg.valid){
//         this.public_key=fg.get("public_key").value;
//         this.secrete_key=fg.get("secrete_key").value;
//         return true;
//     }
//     else {
//         return false;
//     }
// }

// }

// export interface Signalwire {
//     public_key:string;
//     secrete_key:string;
// }

// export interface HTTPSingalwire{
//     public_key:string;
//     secrete_key:string;
// }

// export class SignalwireForm implements HTTPSingalwire{
//     public public_key: string;
//     public secrete_key: string;
//     constructor(data:Signalmash){
//         if(data==null){
//             this.public_key='';
//             this.secrete_key='';
//         }
//         else {
//             this.public_key=data.public_key;
//             this.secrete_key=data.secrete_key;
//         }
//     }



// public makeform(fb:FormBuilder):FormGroup{
//     return fb.group({
//         public_key:[this.public_key,[Validators.required]],
//         secrete_key:[this.secrete_key,[Validators.required]],
//     });
// }


// public saveForm(fg:FormGroup):boolean{
//     if(fg.valid){
//         this.public_key=fg.get("public_key").value;
//         this.secrete_key=fg.get("secrete_key").value;
//         return true
//     }
//     else {
//         return false;
//     }

// }
// }

// export interface Thinq {
//     public_key:string;
//     secrete_key:string;
//     type:string;
// }

// export interface HTTPThinq {
//     public_key:string;
//     secrete_key:string;
//     type:string;
// }

// export class ThinqForm implements HTTPThinq {
//     public public_key: string;
//     public secrete_key: string;
//     public type:string;
//     constructor (data:Thinq){
//         if(data==null){
//             this.public_key='';
//             this.secrete_key='';
//             this.type='Thinq';
//         }
//         else {
//             this.public_key=data.public_key;
//             this.secrete_key=data.secrete_key;
//             this.type=data.type;
//         }
//     }
//  // public makeform(fb: FormBuilder): FormGroup {
// //     return fb.group({
// //         name: [this.name, [Validators.required, Validators.maxLength(50)]],
// //         sms_rate: [this.sms_rate, [Validators.required, Validators.maxLength(5)]],
// //         ib_rate: [this.ib_rate, [Validators.required, Validators.maxLength(5)]],
// //         ob_rate: [this.ob_rate, [Validators.required, Validators.maxLength(5)]],
// //         did_rate: [this.did_rate, [Validators.required, Validators.maxLength(5)]],
// //         rvm_rate: [this.rvm_rate, [Validators.required, Validators.maxLength(5)]],
// //         agent_rate: [this.agent_rate, [Validators.required, Validators.maxLength(5)]]
// //     });
// // }

// public makeform(fb:FormBuilder):FormGroup{
//     return fb.group({
//         public_key:[this.public_key,[Validators.required]],
//         secrete_key:[this.secrete_key,[Validators.required]],
//         type:[this.type,[Validators.required]]
//     });
// }

//     public saveForm(fg:FormGroup):boolean{
//         if(fg.valid){
//             this.public_key=fg.get("public_key").value;
//             this.secrete_key=fg.get("secrete_key").value;
//             this.type=fg.get("type").value;
//             return true
//         }
//         else {
//             return false;
//         }
    
//     }
// }

















// export interface crmlabel {
//     name: string

// }

// export interface Httpcrmlabels {
//     name: string

// }
export class Option {
    name: string | undefined

}
