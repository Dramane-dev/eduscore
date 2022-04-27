import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import ISubject from 'src/app/interfaces/ISubject';
import IScore from 'src/app/interfaces/IScore';
import { Router } from '@angular/router';

export interface Export {
    subjects: ISubject[];
    scores: IScore[];
}

@Injectable({
    providedIn: 'root',
})
export class EduscoreService {
    private _localStorageKey = 'eduscore-data-';
    private _localStorageKeyForUsers = 'eduscore-users';
    private _localStorageCurrentUser = 'eduscore-current-user';
    private _currentUsername: string | null = null;

    private _subjects = new BehaviorSubject<ISubject[]>([]);
    private _scores = new BehaviorSubject<IScore[]>([]);
    private _users = new BehaviorSubject<string[]>([]);

    constructor(private _router: Router) {
        const unparsedUsers = localStorage.getItem(this._localStorageKeyForUsers);
        if (unparsedUsers) {
            const users = JSON.parse(unparsedUsers);
            this._users.next(users);
        }
        const currentUser = localStorage.getItem(this._localStorageCurrentUser);
        if (currentUser) {
            this._currentUsername = currentUser;
            this.refreshData();
        }
    }

    public getAverageFromSubject(subjects: ISubject[]): number {
        if (subjects.length === 0) {
            return 0;
        }
        let num = 0;
        let denum = 0;

        for (const note of subjects) {
            num += note.average * note.coeff;
            denum += note.coeff;
        }

        return num / denum;
    }

    public refreshData() {
        this._loadDataFromStorage();
    }

    public logout() {
        localStorage.removeItem(this._localStorageCurrentUser);
        this._currentUsername = null;
        this._router.navigateByUrl('/');
    }

    public login(username: string) {
        const users = this._users.value;
        if (users.find((u: string) => u === username)) {
            this._currentUsername = username;
            localStorage.setItem(this._localStorageCurrentUser, username);
            this._loadDataFromStorage();
        } else {
            this._users.next([...this._users.value, username]);
            localStorage.setItem(this._localStorageKeyForUsers, JSON.stringify([...this._users.value]));
            localStorage.setItem(this._localStorageKey + username, JSON.stringify({
                subjects: [],
                scores: []
            }));
            this._currentUsername = username;
            localStorage.setItem(this._localStorageCurrentUser, username);
            this._loadDataFromStorage();
        }
        this._router.navigateByUrl('/dashboard');
    }

    public addNewSubject(subject: Omit<ISubject, 'id'>): void {
        const newSubject = {
            ...subject,
            id: uuidv4(),
        };
        this._subjects.next([...this._subjects.value, newSubject]);
        this._saveDataToStorage();
    }

    public updateSubject(subjectId: string, editedSubject: Omit<ISubject, 'id'>): void {
        const subjects = this._subjects.value;
        for (let subject of subjects) {
            if (subject.id === subjectId) {
                subject.coeff = editedSubject.coeff;
                subject.name = editedSubject.name;
            }
        }
        this._subjects.next([...subjects]);
        this._saveDataToStorage();
    }

    public addNewScore(score: Omit<IScore, 'id'>): void {
        const newScore = {
            ...score,
            id: uuidv4(),
        };
        this._scores.next([...this._scores.value, newScore]);
        const concernedSubject = this._subjects.value.find((subject) => subject.id === score.subject_id);
        if (concernedSubject) {
            this._calculeAverageOfSubject(concernedSubject.id);
        }
        this._saveDataToStorage();
    }

    public removeSubject(subjectId: string): void {
        this._subjects.next([...this._subjects.value.filter((subject) => subject.id !== subjectId)]);
        const concernedScore = this._scores.value.filter((score) => score.subject_id === subjectId);
        this._scores.next([
            ...this._scores.value.filter((score) => !concernedScore.map((cs) => cs.id).includes(score.id)),
        ]);
        this._saveDataToStorage();
    }

    public removeScore(scoreId: string): void {
        const concernedScore = this._scores.value.find((score) => score.id === scoreId);
        this._scores.next([...this._scores.value.filter((score) => score.id !== scoreId)]);
        if (concernedScore) {
            const concernedSubject = this._subjects.value.find((subject) => subject.id === concernedScore.subject_id);
            if (concernedSubject) {
                this._calculeAverageOfSubject(concernedSubject.id);
            }
        }
        this._saveDataToStorage();
    }

    public getUsers(): Observable<string[]> {
        return this._users;
    }

    public getSubjects(): Observable<ISubject[]> {
        return this._subjects;
    }

    public getSubject(id: string): Observable<ISubject | undefined> {
        return this._subjects.pipe(map((subjects) => subjects.find((subject) => subject.id === id)));
    }

    public getScores(): Observable<IScore[]> {
        return this._scores;
    }

    public getScoreFromSubjectId(id: string): Observable<IScore[]> {
        return this._scores.pipe(map((scores) => scores.filter((score) => score.subject_id === id)));
    }

    public getScore(id: string): Observable<IScore | undefined> {
        return this._scores.pipe(map((scores) => scores.find((score) => score.id === id)));
    }

    public import(dataToImport: Export): void {
        localStorage.removeItem(this._localStorageKey);
        this._subjects.next(dataToImport.subjects);
        this._scores.next(dataToImport.scores);
        this._saveDataToStorage();
    }

    public export(): Export {
        return {
            subjects: this._subjects.value,
            scores: this._scores.value,
        };
    }

    private _calculeAverageOfSubject(subjectId: string): void {
        const scoresOfSubject = this._scores.value.filter((score) => score.subject_id === subjectId);
        const subjects = this._subjects.value;
        for (let subject of subjects) {
            if (subject.id === subjectId) {
                if (scoresOfSubject.length === 0) {
                    subject.average = 0;
                } else {
                    subject.average =
                        scoresOfSubject
                            .map((score: IScore) => score.score)
                            .reduce((previousScore, currentScore) => previousScore + currentScore, 0) /
                        scoresOfSubject.length;
                }
            }
        }
        this._subjects.next(subjects);
    }

    private _loadDataFromStorage(): void {
        const storedData = localStorage.getItem(this._localStorageKey + this._currentUsername);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log(parsedData);
            this._subjects.next(parsedData.subjects);
            this._scores.next(parsedData.scores);
        }
    }

    private _saveDataToStorage(): void {
        const dataToStore = this.export();
        console.log(dataToStore);
        localStorage.setItem(this._localStorageKey + this._currentUsername, JSON.stringify(dataToStore));
    }
}
