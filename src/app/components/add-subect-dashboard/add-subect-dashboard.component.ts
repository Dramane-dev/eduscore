import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EduscoreService } from 'src/app/services/eduscore.service';
import { EletronService } from 'src/app/services/eletron.service';
import ISubject from 'src/app/interfaces/ISubject';


@Component({
  selector: 'app-add-subect-dashboard',
  templateUrl: './add-subect-dashboard.component.html',
  styleUrls: ['./add-subect-dashboard.component.scss']
})
export class AddSubectDashboardComponent implements OnInit {

  public subjectForm = new FormGroup({
    subject : new FormControl(),
    coeff : new FormControl(1),
  });

  constructor(private _eduScoreService: EduscoreService, private _electronService: EletronService) { }

  ngOnInit(): void {
  }

  addSubject(): void {
    const {subject, coeff} = this.subjectForm.controls
    const newSubject: Omit<ISubject, "id"> = {
      name: subject.value,
      coeff: coeff.value,
      average: 0
    } 
    this._eduScoreService.addNewSubject(newSubject)
    console.log("matière: ",subject.value, "coeff: ",coeff.value, "note: ",0)
    this._electronService.send("close-new-subject-window");

  }


}
