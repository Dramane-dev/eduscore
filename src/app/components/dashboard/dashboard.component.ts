import { Component, OnInit } from '@angular/core';
import { IMaterials } from 'src/app/interfaces/IMaterials';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public pageTitle: string = "Bienvenue sur eduScore";
  public materials: IMaterials[] = [
    {
      name: "Programmation",
      coefficient: 1.5,
      note: 15.01
    },
    {
      name: "Java",
      coefficient: 2,
      note: 15.01
    },
    {
      name: "Electron Js",
      coefficient: 1,
      note: 15.01
    },
  ];
  public studentAverage: number = 0.00;

  constructor() { }

  ngOnInit(): void {
    this.studentAverage = this.calculateAverage();
  }

  openPopup(): void {
  }

  addSubject(): void {
    console.log("lien vers AddSubjectComponent")
  }

  calculateAverage(): number {
    return this.materials.map((material: IMaterials) => material.note ).reduce((previousNote, currentNote) => previousNote + currentNote);
  }
}