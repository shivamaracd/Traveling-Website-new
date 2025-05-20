import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;
  data:any
  constructor( private toest: NgToastService,
    private ngxLoader: NgxUiLoaderService,private fb: FormBuilder, private router: Router, private service:TaskService, private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.initializeForm();
    this.data = this.route.snapshot.paramMap.get('id');
    console.log(this.data);
    this.service.editData(this.data).subscribe((res) => {
      console.log('edit value', res);
      this.taskForm.patchValue({
        subject: res.data[0].subject,
        startDate: res.data[0].startDate,
        deadline: res.data[0].deadline,
        priority: res.data[0].priority,
        decripations: res.data[0].decripations,
        relatedTo: res.data[0].relatedTo
      });
    });
  }

  initializeForm() {
    this.taskForm = this.fb.group({
      subject: [''],
      startDate: [''],
      deadline: [''],
      status: [''],
      priority: [''],
      decripations: [''], 
      relatedTo:['']
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.taskForm.valid) {
      if (this.data) {
        console.log('edit', this.data, this.taskForm.value);
        let value = { id: this.data, data: this.taskForm.value };
        this.ngxLoader.start();
        this.service.editTask(value).subscribe((res) => {
          console.log(res);
          this.toest.success({
            detail: res.message,
            summary: 'Post Successfully',
          });
          this.router.navigate(['task/task']);
          this.ngxLoader.stop();
        });
      } else {
        this.ngxLoader.start();
        this.service.saveService(this.taskForm.value).subscribe((res) => {
          console.log(res);
          this.toest.success({
            detail: res.message,
            summary: 'Post Successfully',
          });
          this.router.navigate(['task/task']);
          this.ngxLoader.stop();
        });
      }
      
    } else {
      this.taskForm.markAllAsTouched(); // Show validation errors if form is invalid
    }
  }

  // Handle cancellation
  onCancel() {
    this.taskForm.reset(); // Clear the form
    this.router.navigate(['/task']); // Navigate to previous page (replace with actual route)
  }

  // Navigate back
  onBack() {
    this.router.navigate(['/task']); // Replace with actual back route
  }

}
