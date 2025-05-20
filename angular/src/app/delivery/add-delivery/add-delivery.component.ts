import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgToastService } from 'ng-angular-popup';
import { ShipmentService } from 'src/app/shipment/shipment.service';
import { DeliveryService } from '../delivery.service';

@Component({
  selector: 'app-add-delivery',
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.scss']
})
export class AddDeliveryComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  deliveryForm!: FormGroup;
  trackingOptions:any
  emailError: string = '';
  profilePic: string | null = null;
  defaultPic: string = '../../../assets/images/image/user-profile.png';
  constructor(
    private toest: NgToastService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private service: DeliveryService,
    private shipment: ShipmentService
    
  ) {
    this.deliveryForm = this.fb.group({
      tracking_number: [''],
      origin: [''],
      booked_on: [''],
      shipper: [''],
      forwarding_no: ['', [Validators.required]],
      consignee_name: [''],
      status: ['Pending'],
      delivery_date: [''],
      delivery_time: [''],
      received_by: [''],
      relation: [''],
      mobile_number: ['']
    });
    
  }
  data: any;

  ngOnInit(): void {
    // this.data = this.route.snapshot.paramMap.get('id');
    // console.log(this.data);
    // this.service.editDataShipment(this.data).subscribe((res) => {
    //   console.log('edit value', res);
    //   // this.deliveryForm.patchValue({
    //   //   client: res.data[0].client,
    //   //   client_department: res.data[0].client_department,
    //   //   tracking_number: res.data[0].tracking_number,
    //   //   order_date: res.data[0].order_date,
    //   //   destination_pincode: res.data[0].destination_pincode,
    //   //   destinations: res.data[0].destinations,
    //   //   configurations_name: res.data[0].configurations_name,
    //   //   configurations_address: res.data[0].configurations_address,
    //   //   configurations_address1: res.data[0].configurations_address1,
    //   //   destination_landmark: res.data[0].destination_landmark,
    //   //   configurations_mobile_number: res.data[0].configurations_mobile_number,
    //   //   remark: res.data[0].remark,
    //   //   remark2: res.data[0].remark2,
    //   //   weight: res.data[0].weight,
    //   //   width: res.data[0].width,
    //   //   height: res.data[0].height,
    //   //   shipping_cost: res.data[0].shipping_cost,
    //   // });
    // })

    this.getData();
    this.getSepment();
    this.deliveryForm.valueChanges.subscribe(()=>{
      this.matchTracking()
    })
  }

  matchTrack : boolean = false;
  matchTracking(){
    const oldMatch = this.trackingOptions.find((v:any) => v.tracking_number === this.deliveryForm.value.tracking_number)
    this.matchTrack = oldMatch
  }

  getSepment(){
    this.shipment.getService().subscribe(res=>{
      console.log(res)
      this.trackingOptions = res
    })
  }
  getData(){
    this.service.getService().subscribe(res=>{
      console.log(res)
      this.data = res
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePic = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onProfilePicChange(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit() {
    console.log('Form Data:', this.deliveryForm.value);
    if (this.deliveryForm.valid) {
      // if (this.data) {
      //   console.log('edit', this.data, this.deliveryForm.value);
      //   let value = { id: this.data, data: this.deliveryForm.value };
      //   this.ngxLoader.start();
      //   // this.service.editClient(value).subscribe((res) => {
      //   //   console.log(res);
      //   //   this.toest.success({
      //   //     detail: res.message,
      //   //     summary: 'Post Successfully',
      //   //   });
      //   //   this.router.navigate(['client/client']);
      //   //   this.ngxLoader.stop();
      //   // });
      // } else {
        // let dubicateTrack = this.data.find((v:any) => v.tracking_number === this.deliveryForm.value.tracking_number)
        // console.log(dubicateTrack)
        // if(dubicateTrack == undefined){
          this.ngxLoader.start();
          this.service.saveService(this.deliveryForm.value).subscribe((res) => {
            this.ngxLoader.stop();
            console.log(res);
            this.toest.success({
              detail: res.message,
              summary: 'Post Successfully',
            });
            this.router.navigate(['delivery/delivery']);
          });
        // }else{
        //   this.toest.error({detail:"Tracking Number is Dublicate", summary: 'Post Successfully',})
        // }
      }
    // } else {
    //   this.validateAllFormFields(this.deliveryForm); // Show error messages for invalid fields
    // }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  onCancel(): void {
    this.deliveryForm.reset();
    this.profilePic = null; // Reset profile picture
    this.router.navigate(['/delivery/delivery']);
  }

  onBack(): void {
    this.router.navigate(['/delivery/delivery']); // Navigate back to member list or previous page
  }
}


