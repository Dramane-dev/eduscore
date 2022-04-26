import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { EduscoreService } from 'src/app/services/eduscore.service';
import IScore from 'src/app/interfaces/IScore';
import { Subscription } from 'rxjs';
import ISubject from 'src/app/interfaces/ISubject';
import { EletronService } from 'src/app/services/eletron.service';

@Component({
  selector: 'app-add-score',
  templateUrl: './add-score.component.html',
  styleUrls: ['./add-score.component.scss']
})
export class AddScoreComponent implements OnInit, OnDestroy {
  public subjectId: string = "";
  public subscription: Subscription = new Subscription();
  public scoreForm: FormGroup = new FormGroup({
    score: new FormControl("")
  });
  public subjects: ISubject[] = [];
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _eduscoreService: EduscoreService,
    private _electronService: EletronService
  ) { }

  ngOnInit(): void {
    this.subscription
    .add(
      this._activatedRoute.params.subscribe((param) => {
        this.subjectId = param.id ? param.id : ""
      })
    );

    if (!this.subjectId) {
      this.subscription
      .add(
        this._eduscoreService.getSubjects().subscribe((subjects) => {
          this.subjects = subjects;
        })
      );
    }
  }

  addScore(): void {
    const { score } = this.scoreForm.controls;
    let newScore: Omit<IScore, 'id'> = {
      subject_id: this.subjectId,
      score: score.value
    };

    this._eduscoreService.addNewScore(newScore);
    this._electronService.send("close-new-score-window");
  };

  selectSubject(subjectId: string): void {
    this.subjectId = subjectId;
  }

  navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
