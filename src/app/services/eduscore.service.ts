import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import ISubject from 'src/app/interfaces/ISubject';
import IScore from 'src/app/interfaces/IScore';

export interface Export {
  subjects: ISubject[];
  scores: IScore[];
}

@Injectable({
  providedIn: 'root'
})
export class EduscoreService {

  private _localStorageKey = 'eduscore-data';

  private _subjects = new BehaviorSubject<ISubject[]>([]);
  private _scores = new BehaviorSubject<IScore[]>([]);

  constructor() {
    this._loadDataFromStorage();
  }

  public refreshData() {
    this._loadDataFromStorage();
  }

  public addNewSubject(subject: Omit<ISubject, 'id'>): void {
    const newSubject = {
      ...subject,
      id: uuidv4()
    };
    this._subjects.next([...this._subjects.value, newSubject]);
    this._saveDataToStorage();
  }

  public addNewScore(score: Omit<IScore, 'id'>): void {
    const newScore = {
      ...score,
      id: uuidv4()
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

  public getSubjects(): Observable<ISubject[]> {
    return this._subjects;
  }

  public getSubject(id: string): Observable<ISubject | undefined> {
    return this._subjects.pipe(
      map((subjects) => subjects.find((subject) => subject.id === id))
    );
  }

  public getScores(): Observable<IScore[]> {
    return this._scores;
  }

  public getScoreFromSubjectId(id: string): Observable<IScore[]> {
    return this._scores.pipe(
      map((scores) => scores.filter((score) => score.subject_id === id))
    );
  }

  public getScore(id: string): Observable<IScore | undefined> {
    return this._scores.pipe(
      map((scores) => scores.find((score) => score.id === id))
    );
  }

  public import(dataToImport: Export): void {
    this._subjects.next(dataToImport.subjects);
    this._scores.next(dataToImport.scores);
    this._saveDataToStorage();
  }

  public export(): Export {
    return {
      subjects: this._subjects.value,
      scores: this._scores.value
    };
  }

  private _calculeAverageOfSubject(subjectId: string): void {
    const scoresOfSubject = this._scores.value.filter((score) => score.subject_id === subjectId);
    const subjects = this._subjects.value;
    for (let subject of subjects) {
      if (subject.id === subjectId) {
        subject.average = scoresOfSubject.map((score: IScore) => score.score ).reduce((previousScore, currentScore) => previousScore + currentScore) / scoresOfSubject.length;
      }
    }
    this._subjects.next(subjects);
  }

  private _loadDataFromStorage(): void {
    const storedData = localStorage.getItem(this._localStorageKey);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this._subjects.next(parsedData.subjects);
      this._scores.next(parsedData.scores);
    }
  }

  private _saveDataToStorage(): void {
    const dataToStore = this.export();
    localStorage.setItem(this._localStorageKey, JSON.stringify(dataToStore));
  }
}
