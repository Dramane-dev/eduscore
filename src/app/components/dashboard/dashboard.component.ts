import { Component, OnInit } from '@angular/core';
import ISubject from 'src/app/interfaces/ISubject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public pageTitle: string = "Bienvenue sur eduScore";
  public materials: ISubject[] = [
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

  constructor() { }

  ngOnInit(): void {
    this.studentAverage = this.calculateAverage();
  }

  openPopup(): void {
  }

  calculateAverage(): number {
    return this.materials.map((material: ISubject) => material.average ).reduce((previousNote, currentNote) => previousNote + currentNote);
  }
}