import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { EduscoreService } from 'src/app/services/eduscore.service';
import IScore from 'src/app/interfaces/IScore';
import { Subscription } from 'rxjs';
import ISubject from 'src/app/interfaces/ISubject';
import { ElectronService } from 'src/app/services/electron.service';

@Component({
    selector: 'app-add-score',
    templateUrl: './add-score.component.html',
    styleUrls: ['./add-score.component.scss'],
})
export class AddScoreComponent implements OnInit, OnDestroy {
    public hasDefaultSubjectId = false;
    public subjectId: string = '';
    public subscription: Subscription = new Subscription();
    public scoreForm: FormGroup = new FormGroup({
        score: new FormControl(0),
    });
    public subjects: ISubject[] = [];
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _eduscoreService: EduscoreService,
        private _electronService: ElectronService
    ) {}

    ngOnInit(): void {
        this.subscription.add(
            this._activatedRoute.params.subscribe((param) => {
                if (param.id) {
                    this.subjectId = param.id;
                    this.hasDefaultSubjectId = true;
                }
            })
        );

        if (!this.subjectId) {
            this.subscription.add(
                this._eduscoreService.getSubjects().subscribe((subjects) => {
                    this.subjects = subjects;
                })
            );
        }
    }

    addScore(): void {
        const { score } = this.scoreForm.controls;
        if (this.subjectId === '') {
            if (this.subjects.length > 0) {
                this.subjectId = this.subjects[0].id;
            } else {
                this._electronService.send('close-new-score-window');
                return;
            }
        }
        let newScore: Omit<IScore, 'id'> = {
            subject_id: this.subjectId,
            score: score.value,
        };

        this._eduscoreService.addNewScore(newScore);
        this._electronService.send('close-new-score-window');
    }

    selectSubject(event: Event): void {
        this.subjectId = (event.target as any).value;
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
