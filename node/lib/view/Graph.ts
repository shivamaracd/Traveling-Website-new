import { UserInterface } from "./UserInterface";
import { Request, Response, NextFunction } from "express";

export class ChatData extends UserInterface
{	
	private _chartype:any={};
	private _stacked:boolean;
	private _series:any=[];
	private _label:any;
	private _field:any;
	private _xaxis:any;
	private _size:number;
	private _zoom:boolean;
	private _yaxis:any=[];
	private _width:any=[4,4,4,4];
	private zoomdetails:any;
	private toolbar:any;

	public constructor(res : Response)
	{	
		super(res);
		this._stacked=false;
		this._size=200;
		this._zoom=false;
		this.zoomdetails={ type: "x", enabled: false, autoScaleYaxis: false };
	}

	public get ChartType(){
		return this._chartype;
	}

	public set ChartType(val){
		this._chartype= val;
	}

	public get Stacked(){
		return this._chartype;
	}

	public set Stacked(val){
		this._stacked= val;
	}

	public set Xaxis(val){
		this._xaxis= val;
	}

	public get Xaxis(){
		return this._xaxis;
	}

	public get Field(){
		return this._field;
	}

	public set Field(val){
		this._field=val;
	}

	public get Size(){
		return this._size;
	}

	public set Size(val){
		this._size=val;
	}

	public get Zoom(){
		return this._zoom;
	}

	public set Zoom(val){
		this.zoomdetails={ type: "x", enabled: val, autoScaleYaxis: val };
		this._zoom=val;
	}

	public prepare(data: any){
		this._data=data;
	}

	getConsolidatedSeries(field:any) {
		let series:any=[];
		console.log("Current fields "+field);
		console.log("Current data "+this._data);
		field.forEach((fields:any) => { 
			if(this._data.length>0){
				if(this._data[0].hasOwnProperty(fields.series))
				{
					let tmp:any;
					if(this._chartype=="bar"|| this._chartype=="area" || this._chartype=="line"){
						this._series=undefined;
					}
					else if(this._chartype=="pie" || this._chartype=="donut" || this._chartype=="radialBar")
					{
						tmp=0;
						this._data.forEach((ele:any) => {
							tmp+=ele[fields.series];
						});
						series.push(tmp);
					}
					else
						tmp=0;
				}
			}
		});

		if(this._chartype=="radialBar"){
			let max:number=0;
			series.forEach((element:any) => {
				if(element>max)
					max=parseInt(element);
			});
			let tmp:any=[];
			series.forEach((element:any) => {
				tmp.push(Math.ceil(parseInt(element)*100/max));
			});
			series=tmp;
		}
		this._series=series;
	}

	getConsolidatedCategory(field:any) {
		let series:any=[];
		if(this._chartype=="bar"|| this._chartype=="area" || this._chartype=="line"){
			this._label=undefined;
		}
		else{
			field.forEach((fields:any) => { 
				series.push(fields.title);
			});
		}
		this._label=series;
	}

	getMax(data:any){
		let max=0;
		data.forEach((element:any) => {
			if(element>max)
				max=element;
		});
		return max;
	}

	getMin(data:any){
		let min=10000000000;
		data.forEach((element:any) => {
			if(element<min)
				min=element;
		});
		return min;
	}

	getMixedSeries(field:any){
		let tmp:any=[];
		const color=["#008FFB","#00E396","#FEB019"];
		let i=0;
		field.forEach((element:any) => {
			tmp[i]=[];
			if(element.type==undefined)
				this._series.push({name: element.title, data:[]});
			else
				this._series.push({name: element.title, type:element.type, data:[]});

			if(element.type!=undefined){
				if(i==0)
					this._yaxis.push({ axisTicks: { show: true }, axisBorder: { show: true, color: color[i]}, labels: { style: { color: color[i] } }, title: { text: element.title, style: { color: color[i] } }, tooltip: { enabled: true }});
				else
					this._yaxis.push({ seriesName: element.title,opposite: true,axisTicks: { show: true }, axisBorder: { show: true, color: color[i]}, labels: { style: { color: color[i] } }, title: { text: element.title, style: { color: color[i] } }, tooltip: { enabled: true }});
			}
			else
				this._yaxis={title:{text:undefined}};
			i++;
		});
		this._data.forEach((ele:any) => {
			let t=0;
			Object.entries(ele).forEach((e:any)=>{
				field.forEach((element:any) => {
					if(e[0]==element.series){
						tmp[t].push(Math.ceil(e[1]));
						t++;
					}
				});
			});
		});
		i=0;
		/*let tmp1:any=[];
		let fact:any=[];
		this._series.forEach((element:any) => {
			let min=Math.ceil(this.getMin(tmp[i])/100);
			console.log("Current min :"+min);
			tmp1[i]=[];
			if(min>1000000)
				fact.push(1000000);
			else if(min>100000 && min<1000000)
				fact.push(100000);
			else if(min>10000 && min<100000)
				fact.push(10000);
			else if(min>1000 && min<10000)
				fact.push(1000);
			else if(min>100 && min<1000)
				fact.push(100);
			else
				fact.push(element);

			tmp[i].forEach((element:any) => {
				if(min>1000000)
					tmp1[i].push(Math.ceil(element/1000000));
				else if(min>100000 && min<1000000)
					tmp1[i].push(Math.ceil(element/100000));
				else if(min>10000 && min<100000)
					tmp1[i].push(Math.ceil(element/10000));
				else if(min>1000 && min<10000)
					tmp1[i].push(Math.ceil(element/1000));
				else if(min>100 && min<1000)
					tmp1[i].push(Math.ceil(element/100));
				else
					tmp1[i].push(element);
			});
			i++;
		});*/

		i=0;
		this._series.forEach((element:any) => {
			element["data"]=tmp[i++];
		});
	}

	getMixedCategory(name:any){
		let tmp:any=[];
		console.log(name);
		this._data.forEach((ele:any) => {
			Object.entries(ele).forEach((e:any)=>{
				if(e[0]==ele.series)
					tmp.push(e[1]);
			});
		});
		this._label=tmp;
	}

	public execute()
	{
		let options:any;
		if(this._series==undefined)
			this.response.status(200).send("No Data");

		if(this._chartype=="bar"|| this._chartype=="area" || this._chartype=="line"){
			options={
				series: this._series,
				chart: { type: this._chartype, height: this._size, stacked: this._stacked, zoom: this.zoomdetails, toolbar: { autoSelected: "zoom"}},
				plotOptions: { bar: { horizontal: false } },
				dataLabels: { enabled: false },
				stroke: { width:  this._width},
				xaxis: { categories: this._label},
				yaxis: this._yaxis,
				tooltip: {
					fixed: {
						enabled: true,
						position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
						offsetY: 30,
						offsetX: 60
					  }
				},
				fill: {opacity: 1},
				legend: {position: "top",horizontalAlign: "left",offsetX: 40}
			};
			//console.log(JSON.stringify(options));
		}
		else if(this._chartype=="pie" || this._chartype=="donut" || this._chartype=="radialBar"){
		  options={
			series: this._series,
			chart: {
			  width: 380,
			  type: this._chartype
			},
			labels: this._label,
			responsive: [
			  {
				breakpoint: 480,
				options: {
				  chart: {
					width: 200
				  },
				  legend: {
					position: "bottom"
				  }
				}
			  }
			]
		  };
		}
		this.response.status(200).send(options);
	}
}