import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {
  fromDate: any;
  toDate: any;;

  constructor(private router:Router){}


  cases = [
    {
      clientName: 'Hiral Ghodasara Bipinbhai',
      caseNumber: '780',
      caseType: 'RCA',
      caseSubType: 'Regular Civil Appeal',
      courtName: 'District & Sessions Court',
      courtNumber: '780',
      magistrate: '11th Ad-Hoc ADDL District Judge',
      petitioner: 'Hiral Ghodasara Bipinbhai',
      respondent: 'Neha Sharma',
      nextDate: '25-12-2019',
      status: 'Urgent Hearing',
      assignToInitial: 'P',
      isImportant: true
    },
    {
      clientName: 'Manishaben U Shah',
      caseNumber: '11/2019',
      caseType: 'Criminal',
      caseSubType: '',
      courtName: 'Domestic Violence Court',
      courtNumber: '5th',
      magistrate: '9th ADDL District Judge',
      petitioner: 'Neha Chopra',
      respondent: 'Manishaben U Shah',
      nextDate: '06-03-2020',
      status: 'Final Hearing',
      assignToInitial: 'P',
      isImportant: false
    }
  ];

  ngOnInit(): void {
    
  }

  searchCases() {
    // Logic to search cases by fromDate and toDate
  }

  clearDates() {
    this.fromDate = '';
    this.toDate = '';
  }


  openClientModal() {
    this.router.navigate(['case/add']);
  }
}




