import { Component, OnInit, OnDestroy } from '@angular/core';
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
    private _eduscoreService: EduscoreService
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
      })
    );
  }

  openPopup(): void {
    this._electronService.send("open-new-score-window");
  }

  deleteScore(scoreId: string): void {
    this._eduscoreService.removeScore(scoreId);
    this._eduscoreService.getScores();
  }

  navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
