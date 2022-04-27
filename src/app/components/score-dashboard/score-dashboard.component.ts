import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import IScore from 'src/app/interfaces/IScore';
import ISubject from 'src/app/interfaces/ISubject';
import { EduscoreService } from 'src/app/services/eduscore.service';
import { ElectronService } from 'src/app/services/electron.service';

@Component({
  selector: 'app-score-dashboard',
  templateUrl: './score-dashboard.component.html',
  styleUrls: ['./score-dashboard.component.scss']
})
export class ScoreDashboardComponent implements OnInit, OnDestroy {
  public subscription: Subscription = new Subscription();
  public subject: ISubject = {
    id: "",
    name: "",
    coeff: 0,
    average: 0
  };
  public scores: IScore[] = [];
  public subjectAverage: number = 0.00;
  public subjectId: string = "";

  constructor(
    private _router: Router, 
    private _activatedRoute: ActivatedRoute,
    private _electronService: ElectronService,
    private _eduscoreService: EduscoreService,
    private _changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription
    .add(
      this._activatedRoute.params.subscribe((param) => {
        this.subjectId = param.id;
      })
    )
    .add(
      this._eduscoreService.getSubject(this.subjectId).subscribe((subject) => {
        this.subject = subject as ISubject;
      })
    )
    .add(      
      this._eduscoreService.getScoreFromSubjectId(this.subjectId).subscribe((scores) => {
        this.scores = scores;
        this.subjectAverage = this.calculateAverage();
        this._changeDetector.detectChanges();
      })
    );
  }

  openPopup(): void {
    this._electronService.send("open-new-score-window", this.subjectId);
  }

  deleteScore(scoreId: string): void {
    this._eduscoreService.removeScore(scoreId);
  }

  navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calculateAverage() {
    if(this.scores.length === 0) {
      return 0;
    }
    return this.scores.reduce((prevScore, currentScore) => prevScore + currentScore.score, 0) / this.scores.length;
  }
}
