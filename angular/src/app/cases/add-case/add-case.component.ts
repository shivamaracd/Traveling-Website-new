import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CaseServiceService } from '../case-service.service';

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.component.html',
  styleUrls: ['./add-case.component.scss']
})
export class AddCaseComponent implements OnInit {
  addCaseForm: FormGroup;

  constructor(private fb: FormBuilder, private router:Router, private service:CaseServiceService) { 
    this.addCaseForm = this.fb.group({
      clientDetail: this.fb.group({
        client: [''],
        respondentName: [''],
        isPetitioner: ['Petitioner'], // Default to Petitioner
        respondentAdvocate: ['']
      }),
      caseDetail: this.fb.group({
        caseNo: [''],
        caseType: [''],
        caseSubType: [''],
        stageOfCase: [''],
        act: [''],
        filingNumber: [''],
        filingDate: [''],
        registrationNumber: [''],
        registrationDate: [''],
        firstHearingDate: [''],
        cnrNumber: [''],
        description: [''],
        priority: ['Medium']
      }),
      firDetail: this.fb.group({
        policeStation: [''],
        firNumber: [''],
        firDate: ['']
      }),
      courtDetail: this.fb.group({
        courtNo: [''],
        courtType: [''],
        court: [''],
        judgeType: [''],
        judgeName: [''],
        remarks: ['']
      }),
      taskAssign: this.fb.group({
        users: ['']
      })
    });
  }

  ngOnInit(): void {
  
  }

  onSubmit() {
    if (this.addCaseForm.valid) {
      console.log(this.addCaseForm.value);
      this.service.saveCase(this.addCaseForm.value).subscribe(res =>{
        console.log(res)
      })
    } else {
      console.log('Form is invalid');
    }
  }


  onBack(): void {
    this.router.navigate(['/case/case']); // Navigate back to member list or previous page
  }
}