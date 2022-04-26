import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ISubject from 'src/app/interfaces/IScore';
import { EletronService } from 'src/app/services/eletron.service';

@Component({
  selector: 'app-score-dashboard',
  templateUrl: './score-dashboard.component.html',
  styleUrls: ['./score-dashboard.component.scss']
})
export class ScoreDashboardComponent implements OnInit {
  public scores: ISubject[] = [
    {
      id: "score_0",
      subject_id: "programmation",
      score: 15.01
    },
    {
      id: "score_1",
      subject_id: "programmation",
      score: 10.00
    },
    {
      id: "score_2",
      subject_id: "programmation",
      score: 20.00
    },
  ];
  public subjectAverage: number = 0.00;

  constructor(private _router: Router, private _electronService: EletronService) { }

  ngOnInit(): void {
    this.calculateSubjectAverage();
  }

  openPopup(): void {
    this._electronService.send("open-new-score-window");
  }

  calculateSubjectAverage(): void {
    this.subjectAverage = this.scores.map((score: ISubject) => score.score ).reduce((previousScore, currentScore) => (previousScore + currentScore) / this.scores.length);
  }

  deleteScore(scoreId: string): void {
    this.scores = this.scores.filter((score: ISubject) => score.id !== scoreId);
    this.calculateSubjectAverage();
  }

  navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }
}
