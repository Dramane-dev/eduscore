import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ISubject from 'src/app/interfaces/ISubject';
import { EduscoreService } from 'src/app/services/eduscore.service';
import { EletronService } from 'src/app/services/eletron.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public subjects: ISubject[] = [
    {
      id: '',
      name: "Programmation",
      coeff: 1,
      average: 15.01
    },
    {
      id: '',
      name: "Java",
      coeff: 1,
      average: 15.01
    },
    {
      id: '',
      name: "Electron Js",
      coeff: 1,
      average: 15.01
    },
  ];
  public studentAverage: number = 0.00;

  constructor(
    private _router: Router,
    private _eduScoreService: EduscoreService,
    private _electronService: EletronService  
  ) { }

  ngOnInit(): void {
  }

  navigateTo(subjectId: string): void {
    this._router.navigateByUrl(`http://localhost:4200/score-dashboard/${subjectId}`);
  }

  addSubject(): void {
    this._electronService.send("open-new-subject-window");
  }
}