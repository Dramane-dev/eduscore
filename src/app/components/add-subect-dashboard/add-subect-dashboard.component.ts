import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EduscoreService } from 'src/app/services/eduscore.service';
import { ElectronService } from 'src/app/services/electron.service';
import ISubject from 'src/app/interfaces/ISubject';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add-subect-dashboard',
    templateUrl: './add-subect-dashboard.component.html',
    styleUrls: ['./add-subect-dashboard.component.scss'],
})
export class AddSubectDashboardComponent implements OnInit, OnDestroy {
    public hasDefaultSubjectId = false;
    public subjectId: string = '';
    public subscription: Subscription = new Subscription();
    public subjectForm = new FormGroup({
        subject: new FormControl(),
        coeff: new FormControl(1),
    });

    constructor(private _eduScoreService: EduscoreService, private _electronService: ElectronService, private _activatedRoute: ActivatedRoute) {}

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscription.add(
            this._activatedRoute.params.subscribe((param) => {
                if (param.id) {
                    this.subjectId = param.id;
                    this.hasDefaultSubjectId = true;
                }
            })
        );

        if (this.subjectId) {
            this.subscription.add(
                this._eduScoreService.getSubject(this.subjectId).subscribe((subject) => {
                    console.log(this.subjectId, subject);
                    this.subjectForm.patchValue({
                        subject: subject?.name,
                        coeff: subject?.coeff
                    })
                })
            );
        }
    }

    addSubject(): void {
        const { subject, coeff } = this.subjectForm.controls;

        if (!subject.value || subject.value === '') {
            return;
        }

        const newSubject: Omit<ISubject, 'id'> = {
            name: subject.value,
            coeff: coeff.value,
            average: 0,
        };
        if (this.hasDefaultSubjectId) {
            this._eduScoreService.updateSubject(this.subjectId, newSubject);
        } else {
            this._eduScoreService.addNewSubject(newSubject);
        }
        this._electronService.send('close-new-subject-window');
    }
}
