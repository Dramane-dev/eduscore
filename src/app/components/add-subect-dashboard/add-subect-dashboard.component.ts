import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EduscoreService } from 'src/app/services/eduscore.service';
import { ElectronService } from 'src/app/services/electron.service';
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

  constructor(private _eduScoreService: EduscoreService, private _electronService: ElectronService) { }

  ngOnInit(): void {
  }

  addSubject(): void {
    const {subject, coeff} = this.subjectForm.controls;

    if (!subject.value || subject.value === '') {
      return;
    }
  
    const newSubject: Omit<ISubject, "id"> = {
      name: subject.value,
      coeff: coeff.value,
      average: 0
    } 
    this._eduScoreService.addNewSubject(newSubject)
    this._electronService.send("close-new-subject-window");

  }


}
