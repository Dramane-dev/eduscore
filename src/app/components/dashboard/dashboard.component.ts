import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import ISubject from 'src/app/interfaces/ISubject';
import { EduscoreService } from 'src/app/services/eduscore.service';
import { ElectronService } from 'src/app/services/electron.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    public subjects: ISubject[] = [];
    public studentAverage: number = 0.0;

    private _subscriptions = new Subscription();

    constructor(
        private _eduScoreService: EduscoreService,
        private _electronService: ElectronService,
        private _router: Router,
        private _changeDetector: ChangeDetectorRef,
        private _ngZone: NgZone
    ) {}

    ngOnInit(): void {
        this._subscriptions.add(
            this._eduScoreService.getSubjects().subscribe((subjects) => {
                this.subjects = subjects;
                this.studentAverage = this._eduScoreService.getAverageFromSubject(subjects);
                this._changeDetector.detectChanges();
            })
        );
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    logout(): void {
        this._eduScoreService.logout();
    }

    navigateToSubject(id: string): void {
        this._ngZone.run(() => {
            this._router.navigateByUrl(`/score-dashboard/${id}`);
        });
    }

    editSubject(id: string): void {
        this._ngZone.run(() => {
            this._electronService.send('open-new-subject-window', id);
        });
    }

    addSubject(): void {
        this._electronService.send('open-new-subject-window');
    }

    removeSubject(id: string): void {
        this._eduScoreService.removeSubject(id);
    }
}
