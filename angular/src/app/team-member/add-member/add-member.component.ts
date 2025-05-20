import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';  // To navigate on 'Back'
import { TeamMemberService } from '../team-member.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CountryStateCityService, Country, State, City } from '../../shared/services/country-state-city.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  GeneratedClientId: string = 'UC000001';
  @ViewChild('fileInput') fileInput!: ElementRef;
  memberForm!: FormGroup;
  emailError: string = '';
  passwordMatchError: boolean = false;
  profilePic: string | null = null;
  defaultPic: string = '../../../assets/images/image/user-profile.png';  // Default profile picture
  data: any;

  // Country, state, city lists
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];

  roleForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private service: TeamMemberService, 
    private toaster: NgToastService, 
    private ngxLoader: NgxUiLoaderService, 
    private route: ActivatedRoute,
    private locationService: CountryStateCityService
  ) {
    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', Validators.required],
      userName: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      country: [''],
      state: [''],
      city: [''],
      role: [''],
      // Bank details
      bank_name: [''],
      account_number: [''],
      account_name: [''],
      ifsc_code: ['', [Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      bank_city: [''],
      bank_state: [''],
      bank_country: [''],
      bank_pincode: [''],
      bank_email: ['']
    });
    this.roleForm = this.fb.group({
      role: [[]], // Default empty array for multiple selections
    });
  }

  // ngAfterViewInit() {
  //   // $('.selectpicker').selectpicker();
  // }

  ngOnInit(): void {
    this.GeneratedClientId = '';
    
    // Check if this is a new member or editing existing
    if (!this.data) {
      // Generate a new member ID for new members
      this.generateMemberId();
    } else {
      // For existing members, fetch the ID from the response
      this.service.getMemberById(this.data).subscribe((res) => {
        if (res.data && res.data.length > 0) {
          this.GeneratedClientId = res.data[0].member_id || 'N/A';
        }
      });
    }
    // Add subscription to password and confirmPassword fields
    this.memberForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
    
    this.memberForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });

    // Load countries
    this.loadCountries();
    
    // Since India is the only country, automatically select it and load its states
    this.memberForm.patchValue({ country: 1 });
    this.loadStates(1);

    // Add listeners for country and state changes
    this.memberForm.get('country')?.valueChanges.subscribe(countryId => {
      if (countryId) {
        this.loadStates(+countryId);
        this.memberForm.patchValue({ state: '', city: '' });
      }
    });

    this.memberForm.get('state')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        this.loadCities(+stateId);
        this.memberForm.patchValue({ city: '' });
      }
    });

    this.data = this.route.snapshot.paramMap.get('id');
    console.log('data', this.data);
    if (this.data) {
      this.service.getMemberById(this.data).subscribe((res) => {
        console.log('edit value', res);
        
        // First load the location data before patching form values
        if (res.data[0].country) {
          this.loadStates(+res.data[0].country);
          
          // Wait a bit for states to load before setting state value
          setTimeout(() => {
            if (res.data[0].state) {
              this.loadCities(+res.data[0].state);
              
              // Wait a bit for cities to load before setting city value
              setTimeout(() => {
                // Now patch all values after location data is loaded
                this.memberForm.patchValue({
                  firstName: res.data[0].firstname,
                  lastName: res.data[0].lastname,
                  email: res.data[0].email,
                  mobileNo: res.data[0].phone_number,
                  userName: res.data[0].username,
                  password: res.data[0].password,
                  confirmPassword: res.data[0].password,
                  address: res.data[0].address,
                  role: JSON.parse(res.data[0].role),
                  country: res.data[0].country,
                  state: res.data[0].state,
                  city: res.data[0].city,
                  bank_name: res.data[0].bank_name,
                  account_number: res.data[0].account_number,
                  account_name: res.data[0].account_name,
                  ifsc_code: res.data[0].ifsc_code,
                  bank_city: res.data[0].bank_city,
                  bank_state: res.data[0].bank_state,
                  bank_country: res.data[0].bank_country,
                  bank_pincode: res.data[0].bank_pincode,
                  bank_email: res.data[0].bank_email
                });
              }, 300);
            } else {
              // If no state, just patch values without waiting for cities
              this.memberForm.patchValue({
                firstName: res.data[0].firstname,
                lastName: res.data[0].lastname,
                email: res.data[0].email,
                mobileNo: res.data[0].phone_number,
                userName: res.data[0].username,
                password: res.data[0].password,
                confirmPassword: res.data[0].password,
                address: res.data[0].address,
                role: JSON.parse(res.data[0].role),
                country: res.data[0].country,
                bank_name: res.data[0].bank_name,
                account_number: res.data[0].account_number,
                account_name: res.data[0].account_name,
                ifsc_code: res.data[0].ifsc_code,
                bank_city: res.data[0].bank_city,
                bank_state: res.data[0].bank_state,
                bank_country: res.data[0].bank_country,
                bank_pincode: res.data[0].bank_pincode,
                bank_email: res.data[0].bank_email
              });
            }
          }, 300);
        } else {
          // If no country data, just patch the form with available data
          this.memberForm.patchValue({
            firstName: res.data[0].firstname,
            lastName: res.data[0].lastname,
            email: res.data[0].email,
            mobileNo: res.data[0].phone_number,
            userName: res.data[0].username,
            password: res.data[0].password,
            confirmPassword: res.data[0].password,
            address: res.data[0].address,
            role: JSON.parse(res.data[0].role),
            bank_name: res.data[0].bank_name,
            account_number: res.data[0].account_number,
            account_name: res.data[0].account_name,
            ifsc_code: res.data[0].ifsc_code,
            bank_city: res.data[0].bank_city,
            bank_state: res.data[0].bank_state,
            bank_country: res.data[0].bank_country,
            bank_pincode: res.data[0].bank_pincode,
            bank_email: res.data[0].bank_email
          });
        }
      });
    }
  }

  // Load countries
  loadCountries(): void {
    this.locationService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  // Load states based on country selection
  loadStates(countryId: number): void {
    this.locationService.getStates(countryId).subscribe(states => {
      this.states = states;
    });
  }

  // Load cities based on state selection
  loadCities(stateId: number): void {
    this.locationService.getCities(stateId).subscribe(cities => {
      this.cities = cities;
    });
  }

  // Function to check if passwords match
  checkPasswordMatch(): void {
    const password = this.memberForm.get('password')?.value;
    const confirmPassword = this.memberForm.get('confirmPassword')?.value;
    
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        this.passwordMatchError = true;
        this.memberForm.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        this.passwordMatchError = false;
        // Only clear errors if there are no other validation errors
        if (!this.memberForm.get('confirmPassword')?.hasError('required')) {
          this.memberForm.get('confirmPassword')?.setErrors(null);
        }
        // Don't call updateValueAndValidity here as it can cause infinite recursion
        // when combined with valueChanges subscriptions
      }
    }
  }

  // onEmailChanges(): void {
  //   this.memberForm.get('email')?.valueChanges.subscribe(email => {
  //     if (email === 'naveenarya@gmail.com') {
  //       this.emailError = 'Email is already exists.';
  //       this.memberForm.get('email')?.setErrors({ exists: true });
  //     } else {
  //       this.emailError = '';
  //     }
  //   });
  // }

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

  onSubmit(): void {
    this.ngxLoader.start();
    // Check password match before submitting
    this.checkPasswordMatch();
    
    if (this.memberForm.valid && !this.passwordMatchError) {
      if (this.data) {
        console.log('edit', this.data, this.memberForm.value);
        let value = { id: this.data, data: this.memberForm.value };
        this.ngxLoader.start();
        this.service.updateMember(value).subscribe((res: any) => {
          console.log(res);
          this.toaster.success({
            detail: res.message,
            summary: 'Post Successfully',
          });
          this.router.navigate(['team/team']);
          this.ngxLoader.stop();
        });
      } else {
        console.log('Form submitted:', this.memberForm.value);
        this.service.saveMember(this.memberForm.value).subscribe(res => {
          console.log(res);
          this.router.navigate(['/team']);
          this.toaster.success({ detail: "Member created successfully!" })
          this.getMember()
          this.ngxLoader.stop();
        })
      }
    } else {
      this.ngxLoader.stop();
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.memberForm.controls).forEach(key => {
        this.memberForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.memberForm.reset();
    this.profilePic = null;  // Reset profile picture
  }

  onBack(): void {
    this.router.navigate(['/team']);  // Navigate back to member list or previous page
  }

  getMember() {
    this.service.getService().subscribe(res => {
      console.log(res);
    })
  }

  generateMemberId(): void {
    this.GeneratedClientId = '';
    this.service.getService().subscribe(res => {
      console.log(res);
    })
  }
}

