import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgToastService } from 'ng-angular-popup';
import { ShipmentService } from '../shipment.service';
import { ClientService } from 'src/app/client/client.service';

@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.scss']
})
export class AddShipmentComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  shipmentForm!: FormGroup;
  emailError: string = '';
  profilePic: string | null = null;
  defaultPic: string = '../../../assets/images/image/user-profile.png';
  clientData: any
  constructor(
    private toest: NgToastService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private service: ShipmentService,
    private clientService: ClientService
  ) {

    this.clientService.getService().subscribe(res => {
      console.log(res)
      this.clientData = res
    })
    // this.shipmentForm = this.fb.group({
    //   client: ['', [Validators.required, Validators.minLength(2)]],
    //   client_department: ['', [Validators.required]],
    //   tracking_number: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
    //   order_date: ['', [Validators.required]],
    //   destination_pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    //   destinations: ['', [Validators.required]],
    //   configurations_name: ['', [Validators.required]],
    //   configurations_address: ['', [Validators.required]],
    //   configurations_address1: [''],
    //   destination_landmark: [''],
    //   configurations_mobile_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    //   remark: [''],
    //   remark2: [''],
    //   volumetric_weight: ['', [Validators.required, Validators.min(0)]],
    //   weight: ['', [Validators.required, Validators.min(0)]],
    //   height: ['', [Validators.required, Validators.min(0)]],
    //   lenght: ['', [Validators.required, Validators.min(0)]],
    //   width: ['', [Validators.required, Validators.min(0)]],
    //   weight2: ['', [Validators.min(0)]],
    //   shipping_cost: ['', [Validators.required, Validators.min(0)]],
    // });
    this.shipmentForm = this.fb.group({
      awb_no: [''],
      ref_no: [''],
      booking_date: [''],
      client: [''],
      billing_service: [''],
      indent_no: [''],
      pickup_point: [''],
      consignor_name: [''],
      company_name: [''],
      origin_city: [''],
      state: [''],
      country: [''],
      pin_code: [''],
      mobile_no: [''],
      alt_mobile_no: [''],
      email_id: [''],
      gstin: [''],
      aadhaar_no: [''],
      warehousing_receipt_no: [''],
      challan_no: [''],
      delivery_no: [''],
      po_no: [''],
      volumetric_weight: [false],
      pkgs: [''],
      actual_weight: [''],
      weight_unit: ['KG'],
      length: [''],
      width: [''],
      height: [''],
      divisor: [''],
      remark: ['Yes']
    });

  }
  data: any;
  idds: any;
  ngOnInit(): void {
    this.data = this.route.snapshot.paramMap.get('id');
    console.log("value", this.data)
    if (this.data) {
      this.service.getShipemntdata(this.data).subscribe((res: any) => {
        console.log('edit value', res);
        this.idds = res.data[0].id;
        this.shipmentForm.patchValue({
          awb_no: res.data[0].awb_no,
          booking_date: res.data[0].booking_date,
          client: res.data[0].client,
          billing_service: res.data[0].billing_service,
          indent_no: res.data[0].indent_no,
          pickup_point: res.data[0].pickup_point,
          consignor_name: res.data[0].consignor_name,
          company_name: res.data[0].company_name,
          origin_city: res.data[0].origin_city,
          state: res.data[0].state,
          country: res.data[0].country,
          pin_code: res.data[0].pin_code,
          mobile_no: res.data[0].mobile_no,
          alt_mobile_no: res.data[0].alt_mobile_no,
          email_id: res.data[0].email_id,
          gstin: res.data[0].gstin,
          aadhaar_no: res.data[0].aadhaar_no,
          warehousing_receipt_no: res.data[0].warehousing_receipt_no,
          challan_no: res.data[0].challan_no,
          delivery_no: res.data[0].delivery_no,
          po_no: res.data[0].po_no,
          ref_no: res.data[0].ref_no,
          remark: res.data[0].remark,
          actual_weight: res.data[0].actual_weight,
          length: res.data[0].length,
          width: res.data[0].width,
          height: res.data[0].height,
          volumetric_weight: res.data[0].volumetric_weight,
          weight_unit: res.data[0].weight_unit,
          divisor: res.data[0].divisor
        });
      });
    }

    this.getData();
    // this.shipmentForm.valueChanges.subscribe(() => {
    //   this.matchTrack();
    // });
  }
  // trackinMatch: boolean = false
  // matchTrack() {
  //   const oldTrack = this.data.find((v: any) => v.tracking_number === this.shipmentForm.value.tracking_number)
  //   console.log(oldTrack)
  //   this.trackinMatch = oldTrack
  // }


  getData() {
    this.service.getService().subscribe(res => {
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
    console.log('Form Data:', this.shipmentForm.value);

    // Mark all fields as touched to show validation messages
    this.validateAllFormFields(this.shipmentForm);

    if (this.shipmentForm.valid) {
      if (this.idds) {
        // Edit mode
        console.log('edit', this.idds, this.shipmentForm.value);
        let value = { id: this.idds, data: this.shipmentForm.value };
        this.ngxLoader.start();
        this.service.updateShipment(value).subscribe({
          next: (res: any) => {
            console.log(res);
            this.toest.success({
              detail: res.message,
              summary: 'Updated Successfully',
            });
            this.router.navigate(['shipment/shipment']);
            this.ngxLoader.stop();
            this.idds = null;
          },
          error: (err) => {
            console.error(err);
            this.toest.error({
              detail: 'Failed to update shipment',
              summary: 'Error'
            });
            this.ngxLoader.stop();
          }
        });
      } else {
        // Create mode
        // let dubicateTrack = this.data.find((v: any) => v.tracking_number === this.shipmentForm.value.tracking_number);
        // console.log(dubicateTrack);
        // if (dubicateTrack == undefined) {
        //   console.log(this.shipmentForm.value);
        //   this.ngxLoader.start();
        this.service.saveService(this.shipmentForm.value).subscribe({
          next: (res) => {
            this.ngxLoader.stop();
            console.log(res);
            this.toest.success({
              detail: res.message,
              summary: 'Saved Successfully',
            });
            this.router.navigate(['shipment/shipment']);
          },
          error: (err) => {
            console.error(err);
            this.toest.error({
              detail: 'Failed to save shipment',
              summary: 'Error'
            });
            this.ngxLoader.stop();
          }
        });
        // } else {
        //   this.toest.error({
        //     detail: "Tracking Number already exists",
        //     summary: 'Validation Error'
        //   });
        // }
      }
    } else {
      this.toest.error({
        detail: "Please fill all required fields correctly",
        summary: 'Validation Error'
      });
    }
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
    this.shipmentForm.reset();
    this.profilePic = null; // Reset profile picture
    this.router.navigate(['/shipment/shipment']);
  }

  onBack(): void {
    this.router.navigate(['/shipment/shipment']); // Navigate back to member list or previous page
  }

  // Form control getters
  // get f() { return this.shipmentForm.controls; }
  // get client() { return this.shipmentForm.get('client'); }
  // get client_department() { return this.shipmentForm.get('client_department'); }
  // get tracking_number() { return this.shipmentForm.get('tracking_number'); }
  // get order_date() { return this.shipmentForm.get('order_date'); }
  // get destination_pincode() { return this.shipmentForm.get('destination_pincode'); }
  // get destinations() { return this.shipmentForm.get('destinations'); }
  // get configurations_name() { return this.shipmentForm.get('configurations_name'); }
  // get configurations_address() { return this.shipmentForm.get('configurations_address'); }
  // get configurations_mobile_number() { return this.shipmentForm.get('configurations_mobile_number'); }
  // get volumetric_weight() { return this.shipmentForm.get('volumetric_weight'); }
  // get weight() { return this.shipmentForm.get('weight'); }
  // get height() { return this.shipmentForm.get('height'); }
  // get lenght() { return this.shipmentForm.get('lenght'); }
  // get width() { return this.shipmentForm.get('width'); }
  // get shipping_cost() { return this.shipmentForm.get('shipping_cost'); }
  // get weight2() { return this.shipmentForm.get('weight2'); }
}
