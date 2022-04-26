import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-subect-dashboard',
  templateUrl: './add-subect-dashboard.component.html',
  styleUrls: ['./add-subect-dashboard.component.scss']
})
export class AddSubectDashboardComponent implements OnInit {

  subjectForm = new FormGroup({

    subject : new FormControl(''),
    coeff : new FormControl(''),

  });

  constructor() { }

  ngOnInit(): void {
  }

  addSubject(): void {
    const {subject, coeff} = this.subjectForm.controls
    console.log("matière: ",subject.value, "coeff: ",coeff.value, "note: ",0)
  }

}
